<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Expense extends Model
{
    use HasFactory, SoftDeletes, \App\Traits\Auditable;

    protected $fillable = [
        'expense_number',
        'expense_category_id',
        'project_id',
        'title',
        'description',
        'amount',
        'expense_date',
        'payment_method',
        'vendor_name',
        'receipt',
        'status',
        'approved_by',
        'approved_at',
        'approval_notes',
        'is_reimbursable',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'expense_date' => 'date',
        'approved_at' => 'datetime',
        'is_reimbursable' => 'boolean',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($expense) {
            if (empty($expense->expense_number)) {
                $year = date('Y');
                $latest = static::withTrashed()
                    ->where('expense_number', 'like', "EXP-{$year}-%")
                    ->orderBy('expense_number', 'desc')
                    ->first();

                $nextNumber = 1;
                if ($latest) {
                    $lastNumber = (int)substr($latest->expense_number, -5);
                    $nextNumber = $lastNumber + 1;
                }

                $expense->expense_number = 'EXP-' . $year . '-' . str_pad($nextNumber, 5, '0', STR_PAD_LEFT);
            }
        });
    }

    public function category()
    {
        return $this->belongsTo(ExpenseCategory::class , 'expense_category_id');
    }

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function approver()
    {
        return $this->belongsTo(User::class , 'approved_by');
    }

    public function approve($userId, $notes = null)
    {
        $this->status = 'approved';
        $this->approved_by = $userId;
        $this->approved_at = now();
        $this->approval_notes = $notes;
        $this->save();
    }

    public function reject($userId, $notes = null)
    {
        $this->status = 'rejected';
        $this->approved_by = $userId;
        $this->approved_at = now();
        $this->approval_notes = $notes;
        $this->save();
    }
}
