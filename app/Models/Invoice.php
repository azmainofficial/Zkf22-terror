<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Invoice extends Model
{
    use HasFactory, SoftDeletes, \App\Traits\Auditable;

    protected $fillable = [
        'invoice_number',
        'client_id',
        'invoice_date',
        'due_date',
        'status',
        'subtotal',
        'tax_amount',
        'discount_amount',
        'total_amount',
        'paid_amount',
        'balance',
        'notes',
        'terms',
        'attachment',
        'is_recurring',
        'recurring_interval',
        'last_recurring_date',
    ];

    protected $casts = [
        'invoice_date' => 'date',
        'due_date' => 'date',
        'subtotal' => 'decimal:2',
        'tax_amount' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'total_amount' => 'decimal:2',
        'paid_amount' => 'decimal:2',
        'balance' => 'decimal:2',
        'is_recurring' => 'boolean',
        'last_recurring_date' => 'date',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($invoice) {
            if (empty($invoice->invoice_number)) {
                $latest = static::withTrashed()
                    ->where('invoice_number', 'like', 'INV-' . date('Y') . '-%')
                    ->latest('id')
                    ->first();

                if ($latest) {
                    $parts = explode('-', $latest->invoice_number);
                    $sequence = intval(end($parts)) + 1;
                }
                else {
                    $sequence = 1;
                }

                $invoice->invoice_number = 'INV-' . date('Y') . '-' . str_pad($sequence, 5, '0', STR_PAD_LEFT);
            }
        });
    }

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function items()
    {
        return $this->hasMany(InvoiceItem::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    public function calculateTotals()
    {
        $this->subtotal = $this->items->sum('amount');
        $this->total_amount = $this->subtotal + $this->tax_amount - $this->discount_amount;
        $this->balance = $this->total_amount - $this->paid_amount;
        $this->save();
    }

    public function updateStatus()
    {
        if ($this->balance <= 0 && $this->paid_amount >= $this->total_amount) {
            $this->status = 'paid';
        }
        elseif ($this->due_date < now() && $this->balance > 0) {
            $this->status = 'overdue';
        }
        elseif ($this->paid_amount > 0 && $this->balance > 0) {
            $this->status = 'partial';
        }
        $this->save();
    }
}
