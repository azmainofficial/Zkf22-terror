<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EmployeeBiometricEnrollment extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_id',
        'biometric_device_id',
        'device_user_id',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    public function device()
    {
        return $this->belongsTo(BiometricDevice::class , 'biometric_device_id');
    }
}
