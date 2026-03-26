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
        Schema::create('slip_designs', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->enum('type', ['invoice', 'payment']);
            $table->string('header_logo')->nullable();
            $table->string('watermark_image')->nullable();
            $table->string('accent_color')->default('#000000');
            $table->string('font_family')->default('Inter');
            $table->text('footer_text')->nullable();
            $table->boolean('is_active')->default(false);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('slip_designs');
    }
};
