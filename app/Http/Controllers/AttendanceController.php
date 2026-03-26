<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\Attendance;
use Illuminate\Http\Request;

class AttendanceController extends Controller
{
    public function store(Request $request, Employee $employee)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'check_in' => 'nullable|string',
            'check_out' => 'nullable|string',
            'status' => 'required|in:present,absent,late,early_leave,on_leave',
            'note' => 'nullable|string',
        ]);

        $attendance = Attendance::updateOrCreate(
            ['employee_id' => $employee->id, 'date' => $validated['date']],
            $validated
        );

        return back()->with('success', 'Attendance record updated.');
    }

    public function destroy(Attendance $attendance)
    {
        $attendance->delete();
        return back()->with('success', 'Attendance record removed.');
    }

    public function export()
    {
        $headers = [
            "Content-type" => "text/csv",
            "Content-Disposition" => "attachment; filename=attendance_export_" . date('Y-m-d') . ".csv",
            "Pragma" => "no-cache",
            "Cache-Control" => "must-revalidate, post-check=0, pre-check=0",
            "Expires" => "0"
        ];

        $columns = ['Employee ID', 'Name', 'Department', 'Date', 'Status', 'Check In', 'Check Out', 'Note'];

        $callback = function () use ($columns) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $columns);

            Attendance::with('employee')->latest('date')->chunk(200, function ($attendances) use ($file) {
                foreach ($attendances as $att) {
                    $row = [
                        $att->employee ? $att->employee->employee_id : 'N/A',
                        $att->employee ? $att->employee->first_name . ' ' . $att->employee->last_name : 'Unknown',
                        $att->employee ? $att->employee->department : 'N/A',
                        $att->date,
                        ucfirst($att->status),
                        $att->check_in,
                        $att->check_out,
                        $att->note,
                    ];

                    fputcsv($file, $row);
                }
            });

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
