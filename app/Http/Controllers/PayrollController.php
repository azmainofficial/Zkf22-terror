<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Payroll;
use App\Models\Employee;
use App\Models\Attendance;
use App\Models\Setting;
use Inertia\Inertia;
use Carbon\Carbon;

class PayrollController extends Controller
{
    public function index(Request $request)
    {
        if (!$request->user()->isAdmin() && !$request->user()->hasPermission('view_payroll')) {
            abort(403, 'Unauthorized access to financial payroll.');
        }

        $month = $request->input('month', now()->month);
        $year = $request->input('year', now()->year);
        $status = $request->input('status');

        $payrolls = Payroll::with('employee')
            ->where('month', $month)
            ->where('year', $year)
            ->when($status, function ($query, $status) {
                return $query->where('status', $status);
            })
            ->latest()
            ->paginate(15)
            ->withQueryString();

        $stats = [
            'total_salary' => (float) Payroll::where('month', $month)->where('year', $year)->sum('total'),
            'paid_salary' => (float) Payroll::where('month', $month)->where('year', $year)->where('status', 'paid')->sum('total'),
            'pending_salary' => (float) Payroll::where('month', $month)->where('year', $year)->where('status', 'pending')->sum('total'),
        ];

        return Inertia::render('Employees/Payroll/Index', [
            'payrolls' => $payrolls,
            'filters' => [
                'month' => (int) $month,
                'year' => (int) $year,
                'status' => $status,
            ],
            'stats' => $stats,
        ]);
    }

    public function generate(Request $request)
    {
        if (!$request->user()->isAdmin() && !$request->user()->hasPermission('create_payroll')) {
            abort(403, 'Unauthorized operation: Generate Payroll.');
        }

        $request->validate([
            'month' => 'required|integer|min:1|max:12',
            'year' => 'required|integer|min:2000|max:2050',
        ]);

        $month = (int) $request->month;
        $year = (int) $request->year;

        // Deduction Settings (Fallback to defaults if not in DB)
        $lateDeductionPerDay = 100; // Fixed amount or logic
        $absentDeductionType = 'per_day'; // 'per_day' or 'percentage'
        
        $holidays = \App\Models\Holiday::all();
        $employees = Employee::where('status', 'active')->get();
        $generatedCount = 0;

        $startDate = Carbon::create($year, $month, 1)->startOfMonth();
        $endDate = Carbon::create($year, $month, 1)->endOfMonth();
        $today = now()->startOfDay();
        $calcEnd = $endDate->gt($today) ? $today : $endDate;
        $totalDaysInMonth = $startDate->daysInMonth;

        // Optimized data fetching for all active employees
        $biometricIds = $employees->pluck('employee_id');
        $allMonthlyLogs = \App\Models\AttendanceLog::whereIn('user_id', $biometricIds)
            ->whereBetween('timestamp', [$startDate->format('Y-m-d 00:00:00'), $endDate->format('Y-m-d 23:59:59')])
            ->get()
            ->groupBy(['user_id', function($log) {
                return Carbon::parse($log->timestamp)->format('Y-m-d');
            }]);

        $allMonthlyLeaves = \App\Models\LeaveApplication::whereIn('employee_id', $employees->pluck('id'))
            ->where('status', 'approved')
            ->where(function($q) use ($startDate, $endDate) {
                $q->whereBetween('start_date', [$startDate->format('Y-m-d'), $endDate->format('Y-m-d')])
                  ->orWhereBetween('end_date', [$startDate->format('Y-m-d'), $endDate->format('Y-m-d')]);
            })->get()
            ->groupBy('employee_id');

        foreach ($employees as $employee) {
            $empLogs = $allMonthlyLogs[$employee->employee_id] ?? collect([]);
            $empLeaves = $allMonthlyLeaves[$employee->id] ?? collect([]);
            
            $presentDays = 0;
            $lateDays = 0;
            $absentDays = 0;
            $leaveCurrentMonth = 0;

            for ($d = clone $startDate; $d <= $calcEnd; $d->addDay()) {
                $currDate = $d->format('Y-m-d');
                $dow = $d->dayOfWeek;

                $isHoliday = $holidays->contains(function($h) use ($currDate, $dow) {
                    return ($h->is_recurring_weekly && $h->day_of_week == $dow) || (!$h->is_recurring_weekly && $h->date === $currDate);
                });

                $isOnLeave = $empLeaves->contains(function($l) use ($currDate) {
                    return $l->start_date <= $currDate && $l->end_date >= $currDate;
                });

                if ($isOnLeave) {
                    $leaveCurrentMonth++;
                    continue;
                }
                
                if ($isHoliday) continue;

                if (isset($empLogs[$currDate])) {
                    $presentDays++;
                    if ($employee->shift) {
                        $dailyLogs = $empLogs[$currDate]->sortBy('timestamp');
                        $dayFirstPunch = $dailyLogs->first();
                        $shiftStart = Carbon::parse($currDate . ' ' . $employee->shift->start_time);
                        $graceTime = (clone $shiftStart)->addMinutes($employee->shift->grace_period);
                        if (Carbon::parse($dayFirstPunch->timestamp)->gt($graceTime)) {
                            $lateDays++;
                        }
                    }
                } else {
                    $absentDays++;
                }
            }

            // Cumulative Leave and Holiday stats
            $totalLeaveTaken = \App\Models\LeaveApplication::where('employee_id', $employee->id)
                ->where('status', 'approved')
                ->sum('total_days');
                
            $yearlyHolidays = \App\Models\Holiday::whereYear('date', $year)->count();

            // Deduction Logic
            $dailyRate = $employee->salary / $totalDaysInMonth;
            $absentDeductionAmount = $absentDays * $dailyRate;
            $lateDeductionAmount = $lateDays * $lateDeductionPerDay;

            $grossPay = (float)$employee->salary; // Basic only initially
            $totalSalary = $grossPay - (float)$absentDeductionAmount - (float)$lateDeductionAmount;

            Payroll::updateOrCreate(
                [
                    'employee_id' => $employee->id,
                    'month' => $month,
                    'year' => $year,
                ],
                [
                    'total_days' => $totalDaysInMonth,
                    'present_days' => $presentDays,
                    'absent_days' => $absentDays,
                    'late_days' => $lateDays,
                    'base_salary' => $employee->salary,
                    'gross_pay' => $grossPay,
                    'absent_deduction' => $absentDeductionAmount,
                    'late_deduction' => $lateDeductionAmount,
                    'total_leave_taken' => $totalLeaveTaken,
                    'leave_current_month' => $leaveCurrentMonth,
                    'yearly_holidays' => $yearlyHolidays,
                    'fund_source' => 'SEC', // Default from Skytouch example
                    'total' => max(0, $totalSalary),
                    'status' => 'pending',
                ]
            );
            $generatedCount++;
        }

        return redirect()->back()->with('success', "Payroll generated for {$generatedCount} employees with attendance deductions.");
    }

    public function update(Request $request, Payroll $payroll)
    {
        if (!$request->user()->isAdmin() && !$request->user()->hasPermission('edit_payroll')) {
            abort(403, 'Unauthorized operation: Edit Payroll Record.');
        }

        $validated = $request->validate([
            'status'           => 'required|in:pending,paid,cancelled',
            'conveyance'       => 'nullable|numeric|min:0',
            'house_rent'       => 'nullable|numeric|min:0',
            'medical_allowance' => 'nullable|numeric|min:0',
            'supervision_allowance' => 'nullable|numeric|min:0',
            'construction_allowance' => 'nullable|numeric|min:0',
            'mobile_allowance'   => 'nullable|numeric|min:0',
            'overtime_pay'       => 'nullable|numeric|min:0',
            'snacks_allowance'   => 'nullable|numeric|min:0',
            'advance_salary'     => 'nullable|numeric|min:0',
            'loan_installment'   => 'nullable|numeric|min:0',
            'bonus'              => 'nullable|numeric|min:0',
            'deductions'         => 'nullable|numeric|min:0',
            'late_deduction'     => 'nullable|numeric|min:0',
            'absent_deduction'   => 'nullable|numeric|min:0',
            'payment_date'       => 'nullable|date',
            'payment_method'     => 'nullable|string',
            'note'               => 'nullable|string',
            'fund_source'        => 'nullable|string',
        ]);

        $payroll->fill($validated);

        // Recalculate Gross Pay
        $payroll->gross_pay = (float)$payroll->base_salary 
            + (float)$payroll->conveyance 
            + (float)$payroll->house_rent 
            + (float)$payroll->medical_allowance 
            + (float)$payroll->supervision_allowance 
            + (float)$payroll->construction_allowance 
            + (float)$payroll->mobile_allowance 
            + (float)$payroll->overtime_pay 
            + (float)$payroll->snacks_allowance;

        // Recalculate Net Total
        $total = (float)$payroll->gross_pay 
            + (float)($validated['bonus'] ?? $payroll->bonus)
            - (float)($validated['deductions'] ?? $payroll->deductions)
            - (float)($validated['late_deduction'] ?? $payroll->late_deduction)
            - (float)($validated['absent_deduction'] ?? $payroll->absent_deduction)
            - (float)($validated['advance_salary'] ?? $payroll->advance_salary)
            - (float)($validated['loan_installment'] ?? $payroll->loan_installment);

        $payroll->total = max(0, $total);
        $payroll->status = $validated['status'];

        if ($request->has('payment_date'))
            $payroll->payment_date = $validated['payment_date'];
        if ($request->has('payment_method'))
            $payroll->payment_method = $validated['payment_method'];
        if ($request->has('note'))
            $payroll->note = $validated['note'];
        if ($request->has('fund_source'))
             $payroll->fund_source = $validated['fund_source'];

        // Create Payment record if status changed to paid
        if ($payroll->isDirty('status') && $payroll->status === 'paid') {
            $payroll->load('employee');
            $employeeName = $payroll->employee->full_name;
            $monthName = Carbon::create($payroll->year, $payroll->month, 1)->format('F');

            \App\Models\Payment::create([
                'payment_type' => 'outgoing',
                'amount' => $payroll->total,
                'payment_date' => $payroll->payment_date ?? now(),
                'payment_method' => $payroll->payment_method ?? 'cash',
                'status' => 'completed',
                'reference_number' => 'PAYROLL-' . $payroll->year . '-' . str_pad($payroll->month, 2, '0', STR_PAD_LEFT) . '-EMP' . $payroll->employee_id,
                'notes' => "Payroll Salary: {$employeeName} - {$monthName} {$payroll->year}",
            ]);
        }

        $payroll->save();

        return redirect()->back()->with('success', 'Payroll updated successfully.');
    }

    public function destroy(Request $request, Payroll $payroll)
    {
        if (!$request->user()->isAdmin() && !$request->user()->hasPermission('delete_payroll')) {
            abort(403, 'Unauthorized operation: Remove Payroll Record.');
        }
        $payroll->delete();
        return redirect()->back()->with('success', 'Payroll record deleted.');
    }

    public function export(Request $request)
    {
        if (!$request->user()->isAdmin() && !$request->user()->hasPermission('view_payroll')) {
            abort(403, 'Unauthorized operation: Export Payroll Data.');
        }
        $month = $request->input('month', now()->month);
        $year = $request->input('year', now()->year);
        $status = $request->input('status');

        $data = Payroll::with('employee')
            ->where('month', $month)
            ->where('year', $year)
            ->when($status, function ($query, $status) {
                return $query->where('status', $status);
            })
            ->latest()
            ->get();

        $monthName = Carbon::create($year, $month, 1)->format('F');
        $fileName = 'payroll-report-' . $monthName . '-' . $year . '.xls';

        return response()->streamDownload(function () use ($data, $monthName, $year) {
            $file = fopen('php://output', 'w');
            fwrite($file, '<html><head><meta charset="utf-8"></head><body>');
            fwrite($file, '<h3>Payroll Report: ' . $monthName . ' ' . $year . '</h3>');
            fwrite($file, '<table border="1"><thead><tr>');

            $headings = [
                'Name', 'Designation', 'Join Date', 'Total (Leave)', 'Leave (Curr Month)', 'Basic Pay', 
                'Conveyance', 'Home Rent', 'Med', 'Supervision', 'Construction', 'Mobile', 
                'Overtime', 'Snacks', 'Gross Pay', 'Advance', 'Installment', 
                'Penalty (Late/Absent)', 'Net Pay', 'Holiday/Year', 'Fund Source', 'Signature'
            ];
            foreach ($headings as $heading) {
                fwrite($file, '<th style="background-color: #fbbf24;">' . $heading . '</th>');
            }
            fwrite($file, '</tr></thead><tbody>');

            foreach ($data as $row) {
                fwrite($file, '<tr>');
                fwrite($file, '<td>' . ($row->employee->full_name ?? 'N/A') . '</td>');
                fwrite($file, '<td>' . ($row->employee->designation ?? '-') . '</td>');
                fwrite($file, '<td>' . ($row->employee->join_date ?? '-') . '</td>');
                fwrite($file, '<td>' . $row->total_leave_taken . '</td>');
                fwrite($file, '<td>' . $row->leave_current_month . '</td>');
                fwrite($file, '<td>' . number_format($row->base_salary, 2, '.', '') . '</td>');
                fwrite($file, '<td>' . number_format($row->conveyance, 2, '.', '') . '</td>');
                fwrite($file, '<td>' . number_format($row->house_rent, 2, '.', '') . '</td>');
                fwrite($file, '<td>' . number_format($row->medical_allowance, 2, '.', '') . '</td>');
                fwrite($file, '<td>' . number_format($row->supervision_allowance, 2, '.', '') . '</td>');
                fwrite($file, '<td>' . number_format($row->construction_allowance, 2, '.', '') . '</td>');
                fwrite($file, '<td>' . number_format($row->mobile_allowance, 2, '.', '') . '</td>');
                fwrite($file, '<td>' . number_format($row->overtime_pay, 2, '.', '') . '</td>');
                fwrite($file, '<td>' . number_format($row->snacks_allowance, 2, '.', '') . '</td>');
                fwrite($file, '<td style="font-weight:bold;">' . number_format($row->gross_pay, 2, '.', '') . '</td>');
                fwrite($file, '<td>' . number_format($row->advance_salary, 2, '.', '') . '</td>');
                fwrite($file, '<td>' . number_format($row->loan_installment, 2, '.', '') . '</td>');
                $penalty = (float)$row->late_deduction + (float)$row->absent_deduction;
                fwrite($file, '<td>' . number_format($penalty, 2, '.', '') . '</td>');
                fwrite($file, '<td style="font-weight:bold;">' . number_format($row->total, 2, '.', '') . '</td>');
                fwrite($file, '<td>' . $row->yearly_holidays . '</td>');
                fwrite($file, '<td>' . ($row->fund_source ?? '-') . '</td>');
                fwrite($file, '<td></td>');
                fwrite($file, '</tr>');
            }

            fwrite($file, '</tbody></table></body></html>');
            fclose($file);
        }, $fileName, [
            'Content-Type' => 'application/vnd.ms-excel',
            'Content-Disposition' => 'attachment; filename="' . $fileName . '"',
        ]);
    }

    public function salarySheet(Request $request)
    {
        if (!$request->user()->isAdmin() && !$request->user()->hasPermission('view_payroll')) {
            abort(403, 'Unauthorized access to salary manifest.');
        }
        $month = $request->input('month', now()->month);
        $year = $request->input('year', now()->year);

        $payrolls = Payroll::with('employee')
            ->where('month', $month)
            ->where('year', $year)
            ->orderBy('employee_id')
            ->get();

        return Inertia::render('Employees/Payroll/SalarySheet', [
            'payrolls' => $payrolls,
            'month' => (int) $month,
            'year' => (int) $year,
        ]);
    }
}
