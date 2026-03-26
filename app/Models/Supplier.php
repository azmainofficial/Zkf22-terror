<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Supplier extends Model
{
    use HasFactory, \App\Traits\Auditable;

    protected $guarded = [];

    protected $casts = [
        'rating' => 'integer',
        'credit_limit' => 'decimal:2',
    ];

    public function brands()
    {
        return $this->hasMany(Brand::class);
    }

    public function purchaseOrders()
    {
        return $this->hasMany(PurchaseOrder::class);
    }

    public function payments()
    {
        return $this->hasMany(SupplierPayment::class);
    }

    // Helper to calculate outstanding balance
    public function getOutstandingBalanceAttribute()
    {
        $totalOrders = $this->purchaseOrders()->where('status', '!=', 'cancelled')->sum('total_amount');
        $totalPayments = $this->payments()->sum('amount');
        return $totalOrders - $totalPayments;
    }
}
