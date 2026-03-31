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
        if (!$request->user()->isAdmin() && !$request->user()->hasPermission('view_employees')) {
            abort(403, 'Unauthorized access to team directory.');
        }

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

        // Fetch raw attendance device logs
        $attendances = \App\Models\AttendanceLog::with('employee')
            ->orderBy('timestamp', 'desc')
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
    public function create(Request $request)
    {
        if (!$request->user()->isAdmin() && !$request->user()->hasPermission('create_employees')) {
            abort(403, 'Unauthorized operation: Register Member.');
        }
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
        if (!$request->user()->isAdmin() && !$request->user()->hasPermission('create_employees')) {
            abort(403, 'Unauthorized operation: Register Member.');
        }
        $validated = $request->validate([
            'employee_id' => 'required|unique:employees',
            'first_name' => 'required',
            'last_name' => 'nullable',
            'email' => 'required|email|unique:employees',
            'phone' => 'required',
            'department' => 'nullable',
            'designation' => 'nullable',
            'salary' => 'nullable|numeric',
            'address' => 'nullable',
            'join_date' => 'nullable|date',
            'status' => 'required|in:active,inactive,on_leave',
            'shift_id' => 'nullable|exists:shifts,id',
            'emergency_contact_name' => 'nullable',
            'emergency_contact_phone' => 'nullable',
            'avatar' => 'nullable|image|max:2048',
            'bio' => 'nullable|string',
            'gender' => 'nullable|string',
            'blood_group' => 'nullable|string',
            'bank_account_no' => 'nullable|string',
            'bank_name' => 'nullable|string',
        ]);

        if ($request->hasFile('avatar')) {
            $validated['avatar'] = $request->file('avatar')->store('avatars', 'public');
        }

        $employee = Employee::create($validated);

        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $index => $file) {
                $title = $request->input("attachments.{$index}.title", 'Document');
                
                \App\Models\EmployeeDocument::create([
                    'employee_id' => $employee->id,
                    'title' => $title,
                    'file_path' => $file->store('employee_documents', 'public'),
                    'file_type' => $file->getClientOriginalExtension(),
                    'file_size' => round($file->getSize() / 1024),
                ]);
            }
        }

        return redirect()->route('employees.index')->with('success', 'Employee registered successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, Employee $employee)
    {
        if (!$request->user()->isAdmin() && !$request->user()->hasPermission('view_employees')) {
            abort(403, 'Unauthorized access to member profile.');
        }
        $employee->load(['shift', 'attendances', 'tasks', 'leaveApplications', 'performanceReviews.reviewer', 'documents']);

        // Calculate leave days correctly (since we don't store duration column)
        $approvedLeaveDays = $employee->leaveApplications()
            ->where('status', 'approved')
            ->get()
            ->sum(function ($l) {
                return (new \DateTime($l->start_date))->diff(new \DateTime($l->end_date))->days + 1;
            });

        return Inertia::render('Employee/Show', [
            'employee' => $employee,
            'stats' => [
                'attendance_rate' => $employee->attendances()->count() > 0 ? round(($employee->attendances()->where('status', 'present')->count() / 30) * 100) : 0,
                'completed_tasks' => $employee->tasks()->where('status', 'completed')->count(),
                'leave_balance' => 15 - $approvedLeaveDays,
            ]
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Request $request, Employee $employee)
    {
        if (!$request->user()->isAdmin() && !$request->user()->hasPermission('edit_employees')) {
            abort(403, 'Unauthorized operation: Edit Member.');
        }
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
        if (!$request->user()->isAdmin() && !$request->user()->hasPermission('edit_employees')) {
            abort(403, 'Unauthorized operation: Update Member.');
        }
        $validated = $request->validate([
            'employee_id' => 'required|unique:employees,employee_id,' . $employee->id,
            'first_name' => 'required',
            'last_name' => 'nullable',
            'email' => 'required|email|unique:employees,email,' . $employee->id,
            'phone' => 'required',
            'department' => 'nullable',
            'designation' => 'nullable',
            'salary' => 'nullable|numeric',
            'address' => 'nullable',
            'join_date' => 'nullable|date',
            'status' => 'required|in:active,inactive,on_leave',
            'shift_id' => 'nullable|exists:shifts,id',
            'emergency_contact_name' => 'nullable',
            'emergency_contact_phone' => 'nullable',
            'bio' => 'nullable|string',
            'gender' => 'nullable|string',
            'blood_group' => 'nullable|string',
            'bank_account_no' => 'nullable|string',
            'bank_name' => 'nullable|string',
        ]);

        $employee->update($validated);

        return redirect()->route('employees.index')->with('success', 'Member updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Employee $employee)
    {
        if (!$request->user()->isAdmin() && !$request->user()->hasPermission('delete_employees')) {
            abort(403, 'Unauthorized operation: Terminate Member.');
        }
        $employee->delete();
        return redirect()->route('employees.index')->with('success', 'Employee deleted successfully.');
    }
}
