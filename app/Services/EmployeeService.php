<?php

namespace App\Services;

use App\Models\Employee;
use App\Models\Attendance;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class EmployeeService
{
    /**
     * Store a newly created employee.
     */
    public function createEmployee(array $data, $avatar = null)
    {
        return DB::transaction(function () use ($data, $avatar) {
            if ($avatar) {
                $data['avatar'] = $avatar->store('employees/avatars', 'public');
            }

            return Employee::create($data);
        });
    }

    /**
     * Update the specified employee.
     */
    public function updateEmployee(Employee $employee, array $data, $avatar = null)
    {
        return DB::transaction(function () use ($employee, $data, $avatar) {
            if ($avatar) {
                if ($employee->avatar) {
                    Storage::disk('public')->delete($employee->avatar);
                }
                $data['avatar'] = $avatar->store('employees/avatars', 'public');
            }

            $employee->update($data);
            return $employee;
        });
    }

    /**
     * Remove the specified employee.
     */
    public function deleteEmployee(Employee $employee)
    {
        return DB::transaction(function () use ($employee) {
            if ($employee->avatar) {
                Storage::disk('public')->delete($employee->avatar);
            }
            return $employee->delete();
        });
    }

    /**
     * Calculate attendance rate for an employee.
     */
    public function calculateAttendanceRate(Employee $employee)
    {
        $lastMonth = now()->subMonth();
        $totalDays = Attendance::where('employee_id', $employee->id)
            ->where('date', '>=', $lastMonth)
            ->count();

        if ($totalDays === 0)
            return 0;

        $presentDays = Attendance::where('employee_id', $employee->id)
            ->where('date', '>=', $lastMonth)
            ->whereIn('status', ['present', 'late'])
            ->count();

        return round(($presentDays / $totalDays) * 100, 1);
    }
}
