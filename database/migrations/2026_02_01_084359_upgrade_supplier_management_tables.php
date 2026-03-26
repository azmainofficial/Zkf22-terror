<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // 1. Upgrade Suppliers Table
        Schema::table('suppliers', function (Blueprint $table) {
            $table->string('status')->default('active')->after('rating');
            $table->string('avatar')->nullable()->after('email');
            $table->string('tax_id')->nullable()->after('credit_limit');
            $table->text('notes')->nullable();
        });

        // 2. Create Purchase Orders Table
        Schema::create('purchase_orders', function (Blueprint $table) {
            $table->id();
            $table->string('po_number')->unique();
            $table->foreignId('supplier_id')->constrained()->onDelete('cascade');
            $table->date('order_date');
            $table->date('expected_delivery_date')->nullable();
            $table->enum('status', ['draft', 'ordered', 'received', 'cancelled'])->default('draft');
            $table->decimal('total_amount', 15, 2)->default(0);
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        // 3. Create Purchase Order Items Table
        Schema::create('purchase_order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('purchase_order_id')->constrained()->onDelete('cascade');
            // If item is in inventory, link it. If new, maybe just string? Let's link to inventory or allow string if flexible.
            // Requirement says "Product Catalog", likely InventoryItems.
            $table->foreignId('inventory_item_id')->constrained()->onDelete('cascade');
            $table->decimal('quantity', 15, 2);
            $table->decimal('unit_price', 15, 2); // Price at time of order
            $table->decimal('total_price', 15, 2);
            $table->timestamps();
        });

        // 4. Create Supplier Payments Table
        Schema::create('supplier_payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('supplier_id')->constrained()->onDelete('cascade');
            $table->string('payment_reference')->nullable(); // Check no, transaction ID
            $table->decimal('amount', 15, 2);
            $table->date('payment_date');
            $table->string('payment_method'); // Bank, Cash, etc.
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('supplier_payments');
        Schema::dropIfExists('purchase_order_items');
        Schema::dropIfExists('purchase_orders');

        Schema::table('suppliers', function (Blueprint $table) {
            $table->dropColumn(['status', 'avatar', 'tax_id', 'notes']);
        });
    }
};
