<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EmployeeTaskController extends Controller
{
    public function store(Request $request, Employee $employee)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'priority' => 'required|in:low,medium,high,urgent',
            'due_date' => 'nullable|date',
        ]);

        $validated['creator_id'] = Auth::id();

        $employee->tasks()->create($validated);

        return back()->with('success', 'Task assigned successfully.');
    }

    public function updateStatus(Request $request, Task $task)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,in_progress,completed,cancelled',
        ]);

        $task->update($validated);

        return back()->with('success', 'Task status updated.');
    }

    public function destroy(Task $task)
    {
        $task->delete();
        return back()->with('success', 'Task removed.');
    }
}
