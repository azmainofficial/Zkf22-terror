<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Change payment_method from ENUM to VARCHAR(255) to support dynamic payment methods
        // Using DB::statement because doctrine/dbal is not installed
        \Illuminate\Support\Facades\DB::statement("ALTER TABLE payments MODIFY COLUMN payment_method VARCHAR(255) NOT NULL DEFAULT 'cash'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert back to ENUM if needed (warning: data loss if values don't match enum)
        // \Illuminate\Support\Facades\DB::statement("ALTER TABLE payments MODIFY COLUMN payment_method ENUM('cash', 'bank_transfer', 'credit_card', 'debit_card', 'cheque', 'online') NOT NULL DEFAULT 'cash'");
    }
};
