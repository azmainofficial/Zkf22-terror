<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\Shift;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EmployeeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Employee::with(['shift', 'attendances']);

        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('first_name', 'like', '%' . $request->search . '%')
                    ->orWhere('last_name', 'like', '%' . $request->search . '%')
                    ->orWhere('employee_id', 'like', '%' . $request->search . '%')
                    ->orWhere('email', 'like', '%' . $request->search . '%');
            });
        }

        if ($request->department && $request->department !== 'All') {
            $query->where('department', $request->department);
        }

        if ($request->status && $request->status !== 'All') {
            $query->where('status', $request->status);
        }

        $departments = Employee::whereNotNull('department')->distinct()->pluck('department');

        // Fetch recent attendances
        $attendances = \App\Models\Attendance::with('employee')
            ->orderBy('date', 'desc')
            ->paginate(15, ['*'], 'att_page')
            ->withQueryString();

        return Inertia::render('Employee/Index', [
            'employees' => $query->latest()->paginate(12)->withQueryString(),
            'attendances' => $attendances,
            'departments' => $departments,
            'filters' => $request->only(['search', 'department', 'status', 'view']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Employee/Create', [
            'shifts' => Shift::all(),
            'departments' => Employee::whereNotNull('department')->distinct()->pluck('department')
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'employee_id' => 'required|unique:employees',
            'first_name' => 'required',
            'last_name' => 'nullable',
            'email' => 'required|email|unique:employees',
            'phone' => 'nullable',
            'department' => 'nullable',
            'designation' => 'nullable',
            'salary' => 'nullable|numeric',
            'address' => 'nullable',
            'join_date' => 'nullable|date',
            'status' => 'required|in:active,inactive,on_leave',
            'shift_id' => 'nullable|exists:shifts,id',
            'emergency_contact_name' => 'nullable',
            'emergency_contact_phone' => 'nullable',
        ]);

        Employee::create($validated);

        return redirect()->route('employees.index')->with('success', 'Employee created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Employee $employee)
    {
        $employee->load(['shift', 'attendances', 'tasks', 'leaveApplications', 'performanceReviews', 'documents']);

        return Inertia::render('Employee/Show', [
            'employee' => $employee,
            'stats' => [
                'attendance_rate' => $employee->attendance_rate ?? 0,
                'completed_tasks' => $employee->tasks()->where('status', 'completed')->count(),
                'leave_balance' => 15 - $employee->leaveApplications()->where('status', 'approved')->sum('duration'),
            ]
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Employee $employee)
    {
        return Inertia::render('Employee/Edit', [
            'employee' => $employee,
            'shifts' => Shift::all(),
            'departments' => Employee::whereNotNull('department')->distinct()->pluck('department')
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Employee $employee)
    {
        $validated = $request->validate([
            'employee_id' => 'required|unique:employees,employee_id,' . $employee->id,
            'first_name' => 'required',
            'last_name' => 'nullable',
            'email' => 'required|email|unique:employees,email,' . $employee->id,
            'phone' => 'nullable',
            'department' => 'nullable',
            'designation' => 'nullable',
            'salary' => 'nullable|numeric',
            'address' => 'nullable',
            'join_date' => 'nullable|date',
            'status' => 'required|in:active,inactive,on_leave',
            'shift_id' => 'nullable|exists:shifts,id',
            'emergency_contact_name' => 'nullable',
            'emergency_contact_phone' => 'nullable',
        ]);

        $employee->update($validated);

        return redirect()->route('employees.index')->with('success', 'Employee updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Employee $employee)
    {
        $employee->delete();
        return redirect()->route('employees.index')->with('success', 'Employee deleted successfully.');
    }
}
