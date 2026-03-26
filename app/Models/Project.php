<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Project extends Model
{
    use HasFactory, SoftDeletes, \App\Traits\Auditable;

    protected $guarded = [];

    protected $casts = [
        'contract_details' => 'array',
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function expenses()
    {
        return $this->hasMany(Expense::class);
    }

    public function projectMaterials()
    {
        return $this->hasMany(ProjectMaterial::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    public function getProfitMarginAttribute()
    {
        if ($this->budget <= 0)
            return 0;
        $profit = $this->budget - $this->actual_cost;
        return ($profit / $this->budget) * 100;
    }

    public function designs()
    {
        return $this->hasMany(ProjectDesign::class);
    }
}
