<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payroll extends Model
{
    use HasFactory, \App\Traits\Auditable;

    protected $fillable = [
        'employee_id', 'month', 'year', 'total_days', 'present_days', 'absent_days', 'late_days',
        'base_salary', 'conveyance', 'house_rent', 'medical_allowance', 'supervision_allowance',
        'construction_allowance', 'mobile_allowance', 'overtime_pay', 'snacks_allowance',
        'gross_pay', 'advance_salary', 'loan_installment', 'total_leave_taken',
        'leave_current_month', 'yearly_holidays', 'fund_source',
        'late_deduction', 'absent_deduction', 'bonus', 'deductions',
        'total', 'status', 'payment_date', 'payment_method', 'note',
    ];

    protected $casts = [
        'base_salary' => 'decimal:2',
        'conveyance' => 'decimal:2',
        'house_rent' => 'decimal:2',
        'medical_allowance' => 'decimal:2',
        'supervision_allowance' => 'decimal:2',
        'construction_allowance' => 'decimal:2',
        'mobile_allowance' => 'decimal:2',
        'overtime_pay' => 'decimal:2',
        'snacks_allowance' => 'decimal:2',
        'gross_pay' => 'decimal:2',
        'advance_salary' => 'decimal:2',
        'loan_installment' => 'decimal:2',
        'total_leave_taken' => 'decimal:2',
        'leave_current_month' => 'decimal:2',
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
