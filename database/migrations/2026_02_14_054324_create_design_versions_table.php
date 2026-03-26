<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration 
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('design_versions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('design_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->integer('version_number'); // 1, 2, 3, etc.
            $table->string('file_path'); // Path to this version's file
            $table->unsignedBigInteger('file_size')->nullable(); // File size in bytes
            $table->string('file_hash')->nullable(); // MD5/SHA hash for integrity
            $table->text('change_description')->nullable(); // What changed in this version
            $table->json('metadata')->nullable(); // Additional version metadata
            $table->boolean('is_current')->default(false); // Is this the active version?
            $table->timestamps();

            // Indexes
            $table->index('design_id');
            $table->index(['design_id', 'version_number']);
            $table->index('is_current');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('design_versions');
    }
};
