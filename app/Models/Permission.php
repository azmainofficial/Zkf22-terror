<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Permission extends Model
{
    use HasFactory, \App\Traits\Auditable;

    protected $fillable = [
        'name',
        'display_name',
        'group',
        'description',
    ];

    /**
     * Roles that have this permission
     */
    public function roles()
    {
        return $this->belongsToMany(Role::class , 'permission_role');
    }
}
