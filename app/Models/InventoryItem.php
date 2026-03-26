<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InventoryItem extends Model
{
    use HasFactory, \App\Traits\Auditable;

    protected $fillable = [
        'name',
        'sku',
        'brand_id',
        'supplier_id',
        'client_id',
        'project_id',
        'unit',
        'quantity_in_stock',
        'reorder_level',
        'unit_price',
        'status',
    ];

    public function brand()
    {
        return $this->belongsTo(Brand::class);
    }

    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function project()
    {
        return $this->belongsTo(Project::class);
    }
}
