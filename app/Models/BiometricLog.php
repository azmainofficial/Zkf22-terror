<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BiometricLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'biometric_device_id',
        'device_user_id',
        'employee_id',
        'punch_time',
        'punch_type',
        'verify_type',
        'processed',
    ];

    protected $casts = [
        'punch_time' => 'datetime',
        'processed' => 'boolean',
    ];

    // Punch type labels matching ZKTeco protocol
    const PUNCH_CHECK_IN = 0;
    const PUNCH_CHECK_OUT = 1;
    const PUNCH_BREAK_OUT = 2;
    const PUNCH_BREAK_IN = 3;
    const PUNCH_OT_IN = 4;
    const PUNCH_OT_OUT = 5;

    // Verify type labels
    const VERIFY_FINGERPRINT = 1;
    const VERIFY_CARD = 2;
    const VERIFY_PASSWORD = 3;
    const VERIFY_FACE = 15;

    public function device()
    {
        return $this->belongsTo(BiometricDevice::class , 'biometric_device_id');
    }

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    public function getPunchTypeLabelAttribute(): string
    {
        return match ($this->punch_type) {
                self::PUNCH_CHECK_IN => 'Check In',
                self::PUNCH_CHECK_OUT => 'Check Out',
                self::PUNCH_BREAK_OUT => 'Break Out',
                self::PUNCH_BREAK_IN => 'Break In',
                self::PUNCH_OT_IN => 'OT In',
                self::PUNCH_OT_OUT => 'OT Out',
                default => 'Unknown',
            };
    }

    public function getVerifyTypeLabelAttribute(): string
    {
        return match ($this->verify_type) {
                self::VERIFY_FINGERPRINT => 'Fingerprint',
                self::VERIFY_CARD => 'Card',
                self::VERIFY_PASSWORD => 'Password',
                self::VERIFY_FACE => 'Face',
                default => 'Unknown',
            };
    }
}
