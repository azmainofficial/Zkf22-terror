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
        $request->validate([
            'month' => 'required|integer|min:1|max:12',
            'year' => 'required|integer|min:2000|max:2050',
        ]);

        $month = (int) $request->month;
        $year = (int) $request->year;

        // Deduction Settings (Fallback to defaults if not in DB)
        $lateDeductionPerDay = 100; // Fixed amount or logic
        $absentDeductionType = 'per_day'; // 'per_day' or 'percentage'
        
        $employees = Employee::where('status', 'active')->get();
        $generatedCount = 0;

        $startDate = Carbon::create($year, $month, 1)->startOfMonth();
        $endDate = Carbon::create($year, $month, 1)->endOfMonth();
        $totalDaysInMonth = $startDate->daysInMonth;

        foreach ($employees as $employee) {
            // Check if payroll already exists
            $exists = Payroll::where('employee_id', $employee->id)
                ->where('month', $month)
                ->where('year', $year)
                ->exists();

            if (!$exists) {
                // Fetch Attendance Stats
                $attendanceStats = Attendance::where('employee_id', $employee->id)
                    ->whereBetween('date', [$startDate->toDateString(), $endDate->toDateString()])
                    ->selectRaw("
                        COUNT(CASE WHEN status = 'present' THEN 1 END) as present_count,
                        COUNT(CASE WHEN status = 'absent' THEN 1 END) as absent_count,
                        COUNT(CASE WHEN status = 'late' THEN 1 END) as late_count
                    ")
                    ->first();

                $presentDays = $attendanceStats->present_count + $attendanceStats->late_count;
                $absentDays = $attendanceStats->absent_count;
                $lateDays = $attendanceStats->late_count;

                // Simple Calculation Logic:
                // 1. Absent Deduction: (Salary / DaysInMonth) * AbsentDays
                $dailyRate = $employee->salary / $totalDaysInMonth;
                $absentDeductionAmount = $absentDays * $dailyRate;

                // 2. Late Deduction: (Example: 3 lates = 1 day salary deduction OR fixed amount)
                // Let's go with a fixed amount per late for now as per user request "deduct amount based on late"
                $lateDeductionAmount = $lateDays * $lateDeductionPerDay;

                $totalSalary = $employee->salary - $absentDeductionAmount - $lateDeductionAmount;

                Payroll::create([
                    'employee_id' => $employee->id,
                    'month' => $month,
                    'year' => $year,
                    'total_days' => $totalDaysInMonth,
                    'present_days' => $presentDays,
                    'absent_days' => $absentDays,
                    'late_days' => $lateDays,
                    'base_salary' => $employee->salary,
                    'absent_deduction' => $absentDeductionAmount,
                    'late_deduction' => $lateDeductionAmount,
                    'total' => max(0, $totalSalary),
                    'status' => 'pending',
                ]);
                $generatedCount++;
            }
        }

        return redirect()->back()->with('success', "Payroll generated for {$generatedCount} employees with attendance deductions.");
    }

    public function update(Request $request, Payroll $payroll)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,paid,cancelled',
            'bonus' => 'nullable|numeric|min:0',
            'deductions' => 'nullable|numeric|min:0',
            'late_deduction' => 'nullable|numeric|min:0',
            'absent_deduction' => 'nullable|numeric|min:0',
            'payment_date' => 'nullable|date',
            'payment_method' => 'nullable|string',
            'note' => 'nullable|string',
        ]);

        // Recalculate total
        $bonus = $validated['bonus'] ?? $payroll->bonus;
        $manualDeductions = $validated['deductions'] ?? $payroll->deductions;
        $lateDeduction = $validated['late_deduction'] ?? $payroll->late_deduction;
        $absentDeduction = $validated['absent_deduction'] ?? $payroll->absent_deduction;

        $payroll->base_salary = $payroll->base_salary; // Keep original
        $payroll->bonus = $bonus;
        $payroll->deductions = $manualDeductions;
        $payroll->late_deduction = $lateDeduction;
        $payroll->absent_deduction = $absentDeduction;
        
        $payroll->total = $payroll->base_salary + $bonus - $manualDeductions - $lateDeduction - $absentDeduction;
        $payroll->status = $validated['status'];

        if ($request->has('payment_date'))
            $payroll->payment_date = $validated['payment_date'];
        if ($request->has('payment_method'))
            $payroll->payment_method = $validated['payment_method'];
        if ($request->has('note'))
            $payroll->note = $validated['note'];

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

    public function destroy(Payroll $payroll)
    {
        $payroll->delete();
        return redirect()->back()->with('success', 'Payroll record deleted.');
    }

    public function salarySheet(Request $request)
    {
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
