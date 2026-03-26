<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Client extends Model
{
    use HasFactory, SoftDeletes, \App\Traits\Auditable;

    protected $fillable = [
        'name',
        'company_name',
        'vat_number',
        'industry',
        'email',
        'phone',
        'address',
        'city',
        'website',
        'linkedin',
        'facebook',
        'twitter',
        'instagram',
        'avatar',
        'logo',
        'status',
        'notes',
    ];

    public function projects()
    {
        return $this->hasMany(Project::class);
    }

    public function invoices()
    {
        return $this->hasMany(Invoice::class);
    }

    public function brands()
    {
        return $this->belongsToMany(Brand::class);
    }

    public function designs()
    {
        return $this->hasMany(Design::class);
    }

    public function inventoryItems()
    {
        return $this->hasMany(InventoryItem::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }
}
