<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\LeaveApplication;
use App\Models\Holiday;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class LeaveController extends Controller
{
    public function index()
    {
        return Inertia::render('Employee/Leaves/Index', [
            'leaves' => LeaveApplication::with('employee')->get(),
            'holidays' => Holiday::all(),
            'employees' => Employee::all(),
        ]);
    }

    public function store(Request $request, Employee $employee)
    {
        $validated = $request->validate([
            'leave_type' => 'required|in:casual,sick,annual,maternity,paternity,unpaid,other',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'reason' => 'required|string',
        ]);

        $employee->leaveApplications()->create($validated);

        return back()->with('success', 'Leave application submitted.');
    }

    public function updateStatus(Request $request, LeaveApplication $leave)
    {
        $validated = $request->validate([
            'status' => 'required|in:approved,rejected',
        ]);

        $leave->update([
            'status' => $validated['status'],
            'approved_by' => Auth::id(),
        ]);

        return back()->with('success', 'Leave status updated.');
    }

    public function destroy(LeaveApplication $leave)
    {
        $leave->delete();
        return back()->with('success', 'Leave application removed.');
    }

    public function storeHoliday(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'is_recurring_weekly' => 'boolean',
            'date' => 'nullable|date',
            'day_of_week' => 'nullable|integer|between:0,6'
        ]);

        Holiday::create($validated);
        return back()->with('success', 'Holiday assigned.');
    }

    public function destroyHoliday(Holiday $holiday)
    {
        $holiday->delete();
        return back()->with('success', 'Holiday removed.');
    }
}
