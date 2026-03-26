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
        // 1. Update Invoices Table
        Schema::table('invoices', function (Blueprint $table) {
            $table->dropForeign(['client_id']);
            $table->foreign('client_id')
                ->references('id')->on('clients')
                ->onDelete('cascade');
        });

        // 2. Update Payments Table
        Schema::table('payments', function (Blueprint $table) {
            $table->dropForeign(['client_id']);
            $table->foreign('client_id')
                ->references('id')->on('clients')
                ->onDelete('cascade');
        });

        // 3. Update Inventory Items Table
        Schema::table('inventory_items', function (Blueprint $table) {
            $table->dropForeign(['client_id']);
            $table->foreign('client_id')
                ->references('id')->on('clients')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert Invoices
        Schema::table('invoices', function (Blueprint $table) {
            $table->dropForeign(['client_id']);
            $table->foreign('client_id')
                ->references('id')->on('clients')
                ->onDelete('set null');
        });

        // Revert Payments
        Schema::table('payments', function (Blueprint $table) {
            $table->dropForeign(['client_id']);
            $table->foreign('client_id')
                ->references('id')->on('clients')
                ->onDelete('set null');
        });

        // Revert Inventory Items
        Schema::table('inventory_items', function (Blueprint $table) {
            $table->dropForeign(['client_id']);
            $table->foreign('client_id')
                ->references('id')->on('clients')
                ->onDelete('set null');
        });
    }
};
