<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Payroll;
use App\Models\Employee;
use Inertia\Inertia;

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
            'total_salary' => Payroll::where('month', $month)->where('year', $year)->sum('total'),
            'paid_salary' => Payroll::where('month', $month)->where('year', $year)->where('status', 'paid')->sum('total'),
            'pending_salary' => Payroll::where('month', $month)->where('year', $year)->where('status', 'pending')->sum('total'),
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

        $month = $request->month;
        $year = $request->year;

        $employees = Employee::where('status', 'active')->get();
        $generatedCount = 0;

        foreach ($employees as $employee) {
            // Check if payroll already exists
            $exists = Payroll::where('employee_id', $employee->id)
                ->where('month', $month)
                ->where('year', $year)
                ->exists();

            if (!$exists) {
                Payroll::create([
                    'employee_id' => $employee->id,
                    'month' => $month,
                    'year' => $year,
                    'base_salary' => $employee->salary,
                    'total' => $employee->salary, // Could add logic for attendance-based deductions here later
                    'status' => 'pending',
                ]);
                $generatedCount++;
            }
        }

        return redirect()->back()->with('success', "Payroll generated for {$generatedCount} employees.");
    }

    public function update(Request $request, Payroll $payroll)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,paid,cancelled',
            'bonus' => 'nullable|numeric|min:0',
            'deductions' => 'nullable|numeric|min:0',
            'payment_date' => 'nullable|date',
            'payment_method' => 'nullable|string',
            'note' => 'nullable|string',
        ]);

        // Recalculate total if bonus/deductions changed
        if (isset($validated['bonus']) || isset($validated['deductions'])) {
            $bonus = $validated['bonus'] ?? $payroll->bonus;
            $deductions = $validated['deductions'] ?? $payroll->deductions;
            $payroll->total = $payroll->base_salary + $bonus - $deductions;
            $payroll->bonus = $bonus;
            $payroll->deductions = $deductions;
        }

        // Update other fields
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
            $employeeName = trim($payroll->employee->first_name . ' ' . $payroll->employee->last_name);
            $monthName = date('F', mktime(0, 0, 0, $payroll->month, 1));

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
