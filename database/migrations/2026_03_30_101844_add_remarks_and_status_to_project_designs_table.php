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
        Schema::table('project_designs', function (Blueprint $table) {
            $table->text('remarks')->nullable()->after('file_type');
            $table->string('status')->default('pending')->after('remarks');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('project_designs', function (Blueprint $table) {
            $table->dropColumn(['remarks', 'status']);
        });
    }
};
