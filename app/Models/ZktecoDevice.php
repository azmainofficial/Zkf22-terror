<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ZktecoDevice extends Model
{
    use HasFactory;
    protected $fillable = ['serial_number', 'device_name', 'ip_address', 'last_seen_at'];

    protected $casts = [
        'last_seen_at' => 'datetime'
    ];
}
