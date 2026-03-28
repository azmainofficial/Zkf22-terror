<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payroll extends Model
{
    use HasFactory, \App\Traits\Auditable;

    protected $fillable = [
        'employee_id',
        'month',
        'year',
        'total_days',
        'present_days',
        'absent_days',
        'late_days',
        'base_salary',
        'late_deduction',
        'absent_deduction',
        'bonus',
        'deductions',
        'total',
        'status',
        'payment_date',
        'payment_method',
        'note',
    ];

    protected $casts = [
        'base_salary' => 'decimal:2',
        'late_deduction' => 'decimal:2',
        'absent_deduction' => 'decimal:2',
        'bonus' => 'decimal:2',
        'deductions' => 'decimal:2',
        'total' => 'decimal:2',
        'payment_date' => 'date',
    ];

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }
}
