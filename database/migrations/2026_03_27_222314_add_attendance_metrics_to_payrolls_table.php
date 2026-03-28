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
        Schema::table('payrolls', function (Blueprint $table) {
            $table->integer('total_days')->default(30)->after('year');
            $table->integer('present_days')->default(0)->after('total_days');
            $table->integer('absent_days')->default(0)->after('present_days');
            $table->integer('late_days')->default(0)->after('absent_days');
            $table->decimal('absent_deduction', 10, 2)->default(0)->after('late_days');
            $table->decimal('late_deduction', 10, 2)->default(0)->after('absent_deduction');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('payrolls', function (Blueprint $table) {
            $table->dropColumn([
                'total_days',
                'present_days',
                'absent_days',
                'late_days',
                'absent_deduction',
                'late_deduction'
            ]);
        });
    }
};
