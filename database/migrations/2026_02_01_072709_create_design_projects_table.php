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
        Schema::create('design_projects', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->foreignId('project_id')->constrained()->onDelete('cascade');
            $table->string('file_path')->nullable();
            $table->string('file_type')->nullable(); // DWG, DXF, etc
            $table->string('version')->default('1.0');
            $table->enum('status', ['draft', 'submitted', 'reviewing', 'approved', 'rejected'])->default('draft');
            $table->foreignId('designer_id')->nullable()->constrained('employees')->onDelete('set null');
            $table->text('comments')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('design_projects');
    }
};
