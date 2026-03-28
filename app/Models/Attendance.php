<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_id',
        'date',
        'clock_in',
        'clock_out',
        'status',
        'note',
        'late_minutes',
        'overtime_minutes',
        'total_worked_minutes',
    ];

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }
}
