<?php

namespace App\Http\Controllers;

use App\Models\AttendanceLog;
use App\Models\Employee;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class AttendanceReportController extends Controller
{
    public function monthly(Request $request)
    {
        $month = $request->input('month', date('m'));
        $year = $request->input('year', date('Y'));

        // Group logs by employee and date
        $dailyLogs = AttendanceLog::with(['employee.shift'])
            ->whereMonth('timestamp', $month)
            ->whereYear('timestamp', $year)
            ->get()
            ->groupBy(function($log) {
                return $log->user_id . '_' . Carbon::parse($log->timestamp)->format('Y-m-d');
            });

        $reportData = $dailyLogs->map(function ($logs) {
            $sortedLogs = $logs->sortBy('timestamp')->values();
            $stats = $this->calculatePairingStats($sortedLogs);
            
            return [
                'user_id' => $sortedLogs->first()->user_id,
                'date' => Carbon::parse($sortedLogs->first()->timestamp)->format('Y-m-d'),
                'first_in' => $stats['first_in'],
                'last_out' => $stats['last_out'],
                'total_minutes' => $stats['total_minutes'],
                'employee' => $sortedLogs->first()->employee,
                'sessions_count' => $stats['sessions_count'],
            ];
        })->groupBy('user_id')->map(function ($userDailyStats, $userId) {
            $totalMinutes = 0;
            $lateCount = 0;
            $daysPresent = $userDailyStats->count();
            $employee = $userDailyStats->first()['employee'];

            foreach ($userDailyStats as $stat) {
                $totalMinutes += $stat['total_minutes'];

                // Punctuality Calculation (Based on first punch of the day)
                if ($employee && $employee->shift && $stat['first_in']) {
                    $shiftStart = Carbon::parse($stat['date'] . ' ' . $employee->shift->start_time);
                    $graceTime = $shiftStart->addMinutes($employee->shift->grace_period);
                    
                    if (Carbon::parse($stat['first_in'])->gt($graceTime)) {
                        $lateCount++;
                    }
                }
            }

            return [
                'employee' => $employee,
                'user_id' => $userId,
                'total_hours' => round($totalMinutes / 60, 2),
                'late_count' => $lateCount,
                'days_present' => $daysPresent,
            ];
        });

        return Inertia::render('Attendance/Report', [
            'reportData' => $reportData->values(),
            'filters' => [
                'month' => $month,
                'year' => $year,
            ],
            'months' => collect(range(1, 12))->map(fn($m) => [
                'value' => str_pad($m, 2, '0', STR_PAD_LEFT),
                'label' => Carbon::create()->month($m)->format('F')
            ])
        ]);
    }

    public function sheet(Request $request)
    {
        $date = $request->input('date', date('Y-m-d'));
        $employees = Employee::with(['shift'])->get();
        $logs = AttendanceLog::whereDate('timestamp', $date)->get()->groupBy('user_id');

        $sheetData = $employees->map(function ($employee) use ($logs, $date) {
            $userLogs = $logs->get($employee->employee_id);
            
            $firstIn = null;
            $lastOut = null;
            $totalHours = 0;
            $status = 'Absent';

            if ($userLogs) {
                $sorted = $userLogs->sortBy('timestamp')->values();
                $stats = $this->calculatePairingStats($sorted);
                
                $firstIn = $stats['first_in'];
                $lastOut = $stats['last_out'];
                $totalHours = round($stats['total_minutes'] / 60, 2);

                $status = 'Present';
                if ($employee->shift && $firstIn) {
                    $shiftStart = Carbon::parse($date . ' ' . $employee->shift->start_time);
                    if (Carbon::parse($firstIn)->gt($shiftStart->addMinutes($employee->shift->grace_period))) {
                        $status = 'Late';
                    }
                }

                $punches = $sorted->map(function($log) {
                    return Carbon::parse($log->timestamp)->format('H:i:s');
                });
            }

            return [
                'employee' => $employee,
                'first_in' => $firstIn ? Carbon::parse($firstIn)->format('H:i:s') : null,
                'last_out' => ($lastOut && $lastOut != $firstIn) ? Carbon::parse($lastOut)->format('H:i:s') : null,
                'total_hours' => $totalHours,
                'status' => $status,
                'punches' => $punches ?? [],
            ];
        });

        return Inertia::render('Attendance/Sheet', [
            'sheetData' => $sheetData,
            'filters' => [
                'date' => $date
            ]
        ]);
    }

    /**
     * Helper to calculate attendance stats using Pair-toggle logic.
     * 1st = In, 2nd = Out, 3rd = In, 4th = Out...
     */
    private function calculatePairingStats($sortedLogs)
    {
        $totalMinutes = 0;
        $firstIn = null;
        $lastOut = null;
        $sessionsCount = 0;

        if ($sortedLogs->isEmpty()) {
            return ['first_in' => null, 'last_out' => null, 'total_minutes' => 0, 'sessions_count' => 0];
        }

        $firstIn = $sortedLogs->first()->timestamp;
        
        // Loop in pairs
        for ($i = 0; $i < $sortedLogs->count(); $i += 2) {
            $inLog = $sortedLogs->get($i);
            $outLog = $sortedLogs->get($i + 1);

            if ($inLog && $outLog) {
                $start = Carbon::parse($inLog->timestamp);
                $end = Carbon::parse($outLog->timestamp);
                $totalMinutes += $end->diffInMinutes($start);
                $lastOut = $outLog->timestamp;
                $sessionsCount++;
            }
        }

        // If total logs is odd, the last one is an "active" IN without an OUT yet
        // We don't add its minutes yet as it's not a complete session.
        
        return [
            'first_in' => $firstIn,
            'last_out' => $lastOut,
            'total_minutes' => $totalMinutes,
            'sessions_count' => $sessionsCount
        ];
    }
}
