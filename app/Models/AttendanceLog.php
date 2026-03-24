<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AttendanceLog extends Model
{
    use HasFactory;
    protected $fillable = ['zkteco_device_id', 'user_id', 'timestamp', 'state', 'raw_data'];

    public function device()
    {
        return $this->belongsTo(ZktecoDevice::class, 'zkteco_device_id');
    }

    public function employee()
    {
        return $this->belongsTo(Employee::class, 'user_id', 'employee_id');
    }
}
