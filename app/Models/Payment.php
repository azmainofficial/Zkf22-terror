<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Payment extends Model
{
    use HasFactory, SoftDeletes, \App\Traits\Auditable;

    protected $fillable = [
        'payment_number',
        'invoice_id',
        'client_id',
        'project_id',
        'payment_type',
        'payment_date',
        'amount',
        'payment_method',
        'reference_number',
        'status',
        'notes',
        'receipt',
    ];

    protected $casts = [
        'payment_date' => 'date',
        'amount' => 'decimal:2',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($payment) {
            if (empty($payment->payment_number)) {
                $year = date('Y');
                $latest = static::withTrashed()
                    ->where('payment_number', 'like', "PAY-{$year}-%")
                    ->orderBy('payment_number', 'desc')
                    ->first();

                $nextNumber = 1;
                if ($latest) {
                    $lastNumber = (int)substr($latest->payment_number, -5);
                    $nextNumber = $lastNumber + 1;
                }

                $payment->payment_number = 'PAY-' . $year . '-' . str_pad($nextNumber, 5, '0', STR_PAD_LEFT);
            }
        });

        static::saved(function ($payment) {
            if ($payment->invoice_id && $payment->status === 'completed') {
                $invoice = $payment->invoice;
                $invoice->paid_amount = $invoice->payments()->where('status', 'completed')->sum('amount');
                $invoice->balance = $invoice->total_amount - $invoice->paid_amount;
                $invoice->save();
                $invoice->updateStatus();
            }
        });
    }

    public function invoice()
    {
        return $this->belongsTo(Invoice::class);
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
