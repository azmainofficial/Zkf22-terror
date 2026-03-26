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
        Schema::create('inventory_items', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('sku')->unique()->nullable();
            $table->foreignId('brand_id')->nullable()->constrained()->onDelete('set null');
            $table->string('unit')->default('pcs'); // pcs, kg, meter, etc
            $table->decimal('quantity_in_stock', 15, 2)->default(0);
            $table->decimal('reorder_level', 15, 2)->default(10);
            $table->decimal('unit_price', 15, 2)->default(0);
            $table->enum('status', ['active', 'inactive', 'discontinued'])->default('active');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inventory_items');
    }
};
