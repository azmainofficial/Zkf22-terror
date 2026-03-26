<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // Check if table exists, if not create it
        if (!Schema::hasTable('expenses')) {
            Schema::create('expenses', function (Blueprint $table) {
                $table->id();
                $table->string('expense_number')->unique();
                $table->foreignId('expense_category_id')->nullable()->constrained()->nullOnDelete();
                $table->foreignId('project_id')->nullable()->constrained()->nullOnDelete();
                $table->string('title');
                $table->text('description')->nullable();
                $table->decimal('amount', 15, 2);
                $table->date('expense_date');
                $table->enum('payment_method', ['cash', 'bank_transfer', 'credit_card', 'debit_card', 'cheque', 'online'])->default('cash');
                $table->string('vendor_name')->nullable();
                $table->string('receipt')->nullable();
                $table->enum('status', ['pending', 'approved', 'rejected', 'paid'])->default('pending');
                $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
                $table->timestamp('approved_at')->nullable();
                $table->text('approval_notes')->nullable();
                $table->boolean('is_reimbursable')->default(false);
                $table->timestamps();
                $table->softDeletes();
            });
        } else {
            // Update existing table
            Schema::table('expenses', function (Blueprint $table) {
                if (!Schema::hasColumn('expenses', 'expense_number')) {
                    $table->string('expense_number')->unique()->after('id');
                }
                if (!Schema::hasColumn('expenses', 'expense_category_id')) {
                    $table->foreignId('expense_category_id')->nullable()->constrained()->nullOnDelete()->after('expense_number');
                }
                if (!Schema::hasColumn('expenses', 'receipt')) {
                    $table->string('receipt')->nullable()->after('vendor_name');
                }
                if (!Schema::hasColumn('expenses', 'status')) {
                    $table->enum('status', ['pending', 'approved', 'rejected', 'paid'])->default('pending')->after('receipt');
                }
                if (!Schema::hasColumn('expenses', 'approved_by')) {
                    $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete()->after('status');
                }
                if (!Schema::hasColumn('expenses', 'approved_at')) {
                    $table->timestamp('approved_at')->nullable()->after('approved_by');
                }
                if (!Schema::hasColumn('expenses', 'approval_notes')) {
                    $table->text('approval_notes')->nullable()->after('approved_at');
                }
                if (!Schema::hasColumn('expenses', 'is_reimbursable')) {
                    $table->boolean('is_reimbursable')->default(false)->after('approval_notes');
                }
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('expenses')) {
            Schema::table('expenses', function (Blueprint $table) {
                $columns = ['expense_number', 'expense_category_id', 'receipt', 'status', 'approved_by', 'approved_at', 'approval_notes', 'is_reimbursable'];
                foreach ($columns as $column) {
                    if (Schema::hasColumn('expenses', $column)) {
                        $table->dropColumn($column);
                    }
                }
            });
        }
    }
};
