<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;


use App\Models\ZktecoDevice;
use App\Models\AttendanceLog;
use App\Models\Employee;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ZktecoADMSController extends Controller
{
    public function index(Request $request)
    {
        $date = $request->query('date', now()->format('Y-m-d'));
        
        // Fetch employees with their active shift and today's biometric logs
        $query = Employee::with(['shift', 'attendanceLogs' => function($q) use ($date) {
            $q->whereDate('timestamp', $date)->orderBy('timestamp', 'asc');
        }]);

        if ($request->has('search')) {
            $searchTerm = $request->search;
            $query->where(function($q) use ($searchTerm) {
                $q->where('employee_id', 'like', "%{$searchTerm}%")
                  ->orWhere('first_name', 'like', "%{$searchTerm}%")
                  ->orWhere('last_name', 'like', "%{$searchTerm}%");
            });
        }

        $paginator = $query->paginate(20)->withQueryString();

        $employees = $paginator->getCollection()->map(function($employee) {
            $logs = $employee->attendanceLogs;
            $firstPunch = $logs->first();
            $lastPunch = $logs->count() > 1 ? $logs->last() : null;

            $status = 'Out';
            if ($logs->count() % 2 !== 0) {
                $status = 'In';
            }

            return [
                'id' => $employee->id,
                'employee_id' => $employee->employee_id,
                'name' => $employee->first_name . ' ' . $employee->last_name,
                'department' => $employee->department,
                'status' => $status,
                'punches' => $logs->count(),
                'all_punches' => $logs->map(function($log) {
                    return \Carbon\Carbon::parse($log->timestamp)->format('H:i');
                })->values()->toArray(),
                'entry_time' => $firstPunch ? \Carbon\Carbon::parse($firstPunch->timestamp)->format('H:i') : null,
                'exit_time' => $lastPunch ? \Carbon\Carbon::parse($lastPunch->timestamp)->format('H:i') : null,
            ];
        });
        
        $paginator->setCollection($employees);

        return Inertia::render('Attendance/Index', [
            'employees' => $paginator,
            'filters' => [
                'search' => $request->search ?? '',
                'date' => $date
            ]
        ]);
    }

    public function calendarView(Request $request)
    {
        $month = $request->month ?? \Carbon\Carbon::now()->format('Y-m');
        $start = \Carbon\Carbon::parse($month . '-01')->startOfMonth();
        $end = \Carbon\Carbon::parse($month . '-01')->endOfMonth();

        // Get single employee context (default to first active if none passed)
        $employeeId = $request->employee_id;
        if (!$employeeId) {
            $firstEmp = \App\Models\Employee::first();
            $employeeId = $firstEmp ? $firstEmp->id : null;
        }

        $employees = \App\Models\Employee::with('shift')->get();
        if ($employeeId && $employees->where('id', $employeeId)->isEmpty()) {
            abort(404, 'Employee not found');
        }

        $leaves = collect([]);
        $holidays = collect([]);
        $attendances = [];

        // Only process raw logs for this specific employee to save overhead
        if ($employeeId) {
            $empRecord = $employees->firstWhere('id', $employeeId);
            
            $leaves = \App\Models\LeaveApplication::where('employee_id', $employeeId)
                        ->where('status', 'approved')
                        ->where(function($q) use ($start, $end) {
                            $q->whereBetween('start_date', [$start->format('Y-m-d'), $end->format('Y-m-d')])
                              ->orWhereBetween('end_date', [$start->format('Y-m-d'), $end->format('Y-m-d')]);
                        })->get();
            $holidays = \App\Models\Holiday::all();

            $logs = \App\Models\AttendanceLog::where('user_id', $empRecord->employee_id)
                ->whereBetween('timestamp', [
                    $start->format('Y-m-d 00:00:00'), 
                    $end->format('Y-m-d 23:59:59')
                ])->get()->groupBy(function($log) {
                    return \Carbon\Carbon::parse($log->timestamp)->format('Y-m-d');
                });

            foreach ($logs as $date => $dailyLogs) {
                $sorted = $dailyLogs->sortBy('timestamp')->values();
                $firstIn = $sorted->first()->timestamp;
                $lastOut = $sorted->count() > 1 ? $sorted->last()->timestamp : null;

                $lateMinutes = 0;
                $overtimeMinutes = 0;
                $totalWorked = 0;
                $status = 'present';

                if ($lastOut) {
                    $totalWorked = \Carbon\Carbon::parse($lastOut)->diffInMinutes(\Carbon\Carbon::parse($firstIn));
                }

                $isHoliday = $holidays->contains(function($h) use ($date) {
                    $dow = \Carbon\Carbon::parse($date)->dayOfWeek;
                    return ($h->is_recurring_weekly && $h->day_of_week == $dow) || (!$h->is_recurring_weekly && $h->date === $date);
                });
                $isOnLeave = $leaves->contains(function($l) use ($date) {
                    return $l->start_date <= $date && $l->end_date >= $date;
                });
                
                $isOffDay = $isHoliday || $isOnLeave;

                if ($empRecord->shift) {
                    $shiftStart = \Carbon\Carbon::parse($date . ' ' . $empRecord->shift->start_time);
                    $firstInParsed = \Carbon\Carbon::parse($firstIn);
                    
                    if (!$isOffDay) {
                        $graceTime = (clone $shiftStart)->addMinutes($empRecord->shift->grace_period);
                        if ($firstInParsed->gt($graceTime)) {
                            $lateMinutes = $firstInParsed->diffInMinutes($shiftStart);
                            $status = 'late';
                        }
                    }

                    if ($lastOut) {
                        $shiftEnd = \Carbon\Carbon::parse($date . ' ' . $empRecord->shift->end_time);
                        $lastOutParsed = \Carbon\Carbon::parse($lastOut);
                        if ($lastOutParsed->gt($shiftEnd)) {
                            $overtimeMinutes = $lastOutParsed->diffInMinutes($shiftEnd);
                        }
                    }
                }

                \App\Models\Attendance::updateOrCreate(
                    ['employee_id' => $empRecord->id, 'date' => $date],
                    [
                        'clock_in' => \Carbon\Carbon::parse($firstIn)->format('H:i:s'),
                        'clock_out' => $lastOut ? \Carbon\Carbon::parse($lastOut)->format('H:i:s') : null,
                        'status' => $status,
                        'late_minutes' => $lateMinutes,
                        'overtime_minutes' => $overtimeMinutes,
                        'total_worked_minutes' => $totalWorked
                    ]
                );
            }
        }

        if ($employeeId) {
            $attendances = \App\Models\Attendance::where('employee_id', $employeeId)
                ->whereBetween('date', [$start->format('Y-m-d'), $end->format('Y-m-d')])
                ->get()
                ->keyBy('date');
        }

        return Inertia::render('Attendance/Calendar', [
            'attendances' => $attendances,
            'leaves'      => $leaves,
            'holidays'    => $holidays,
            'employees' => $employees->map(function($e) {
                return ['id' => $e->id, 'name' => $e->first_name . ' ' . $e->last_name, 'employee_id' => $e->employee_id];
            })->values(),
            'currentEmployeeId' => (int)$employeeId,
            'monthStr' => $month,
            'filters' => [
                'month' => $month,
                'employee_id' => $employeeId
            ]
        ]);
    }

    /**
     * Handle the device's main data communication (handshake and log upload).
     */
    public function handleCData(Request $request)
    {
        $sn = $request->query('SN');
        $table = $request->query('table');

        if (!$sn) {
            return response("OK", 200);
        }

        // Register or update device
        $device = ZktecoDevice::firstOrCreate(['serial_number' => $sn]);
        $device->last_seen_at = now();
        $device->save();

        // Handle GET (Handshake/Registry)
        if ($request->isMethod('get')) {
            return response("OK", 200)->header('Content-Type', 'text/plain');
        }

        // Handle POST (Data Upload)
        $content = $request->getContent();

        if ($table === 'ATTLOG') {
            $lines = explode("\n", trim($content));
            foreach ($lines as $line) {
                if (empty(trim($line)))
                    continue;

                $data = preg_split('/\s+/', trim($line));
                if (count($data) >= 2) {
                    AttendanceLog::create([
                        'zkteco_device_id' => $device->id,
                        'user_id' => $data[0],
                        'timestamp' => $data[1] . ' ' . ($data[2] ?? '00:00:00'),
                        'state' => $data[3] ?? 0,
                        'raw_data' => $line
                    ]);
                }
            }
        }

        return response("OK", 200)->header('Content-Type', 'text/plain');
    }

    /**
     * Handle device command requests (polling).
     */
    public function handleGetRequest(Request $request)
    {
        $sn = $request->query('SN');
        if ($sn) {
            $device = ZktecoDevice::firstOrCreate(['serial_number' => $sn]);
            $device->last_seen_at = now();
            $device->save();
        }

        // For now, always respond with OK to keep the heartbeat alive
        return response("OK", 200)->header('Content-Type', 'text/plain');
    }
}
