<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
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
        'shift_id'
    ];

    public function shift()
    {
        return $this->belongsTo(Shift::class);
    }
}
