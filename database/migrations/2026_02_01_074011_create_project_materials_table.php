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
        Schema::create('project_materials', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained()->onDelete('cascade');
            $table->foreignId('inventory_item_id')->constrained()->onDelete('cascade');
            $table->decimal('quantity_needed', 15, 2)->default(0);
            $table->decimal('quantity_ordered', 15, 2)->default(0);
            $table->decimal('quantity_received', 15, 2)->default(0);
            $table->decimal('quantity_used', 15, 2)->default(0);
            $table->decimal('unit_cost', 15, 2)->default(0);
            $table->string('status')->default('pending'); // pending, ordered, partially_received, received, used
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('project_materials');
    }
};
