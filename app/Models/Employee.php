<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    use HasFactory, \Illuminate\Database\Eloquent\SoftDeletes, \App\Traits\Auditable;

    protected $fillable = [
        'employee_id',
        'first_name',
        'last_name',
        'email',
        'phone',
        'department',
        'designation',
        'join_date',
        'status',
        'photo_path',
        'shift_id',
        'salary',
        'address',
        'avatar'
    ];

    public function shift()
    {
        return $this->belongsTo(Shift::class);
    }

    /**
     * ZKTeco biometric attendance logs (linked via employee_id field value stored as user_id)
     */
    public function attendanceLogs()
    {
        return $this->hasMany(AttendanceLog::class, 'user_id', 'employee_id');
    }

    /**
     * Manual attendance records
     */
    public function attendances()
    {
        return $this->hasMany(\App\Models\Attendance::class, 'employee_id');
    }

    public function leaveApplications()
    {
        return $this->hasMany(LeaveApplication::class);
    }

    public function tasks()
    {
        return $this->hasMany(Task::class);
    }

    public function performanceReviews()
    {
        return $this->hasMany(PerformanceReview::class);
    }

    public function documents()
    {
        return $this->hasMany(EmployeeDocument::class);
    }

    // Full name accessor
    public function getFullNameAttribute()
    {
        return "{$this->first_name} {$this->last_name}";
    }
}
