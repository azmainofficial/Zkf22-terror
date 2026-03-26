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
        Schema::table('invoices', function (Blueprint $table) {
            $table->boolean('is_recurring')->default(false)->after('balance');
            $table->enum('recurring_interval', ['daily', 'weekly', 'monthly', 'yearly'])->nullable()->after('is_recurring');
            $table->date('last_recurring_date')->nullable()->after('recurring_interval');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('invoices', function (Blueprint $table) {
            $table->dropColumn(['is_recurring', 'recurring_interval', 'last_recurring_date']);
        });
    }
};
