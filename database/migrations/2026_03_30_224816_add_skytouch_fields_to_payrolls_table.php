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
            $table->decimal('conveyance', 10, 2)->default(0)->after('base_salary');
            $table->decimal('house_rent', 10, 2)->default(0)->after('conveyance');
            $table->decimal('medical_allowance', 10, 2)->default(0)->after('house_rent');
            $table->decimal('supervision_allowance', 10, 2)->default(0)->after('medical_allowance');
            $table->decimal('construction_allowance', 10, 2)->default(0)->after('supervision_allowance');
            $table->decimal('mobile_allowance', 10, 2)->default(0)->after('construction_allowance');
            $table->decimal('overtime_pay', 10, 2)->default(0)->after('mobile_allowance');
            $table->decimal('snacks_allowance', 10, 2)->default(0)->after('overtime_pay');
            $table->decimal('gross_pay', 10, 2)->default(0)->after('snacks_allowance');
            $table->decimal('advance_salary', 10, 2)->default(0)->after('gross_pay');
            $table->decimal('loan_installment', 10, 2)->default(0)->after('advance_salary');
            $table->decimal('total_leave_taken', 8, 2)->default(0)->after('loan_installment');
            $table->decimal('leave_current_month', 8, 2)->default(0)->after('total_leave_taken');
            $table->integer('yearly_holidays')->default(0)->after('leave_current_month');
            $table->string('fund_source')->nullable()->after('yearly_holidays');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('payrolls', function (Blueprint $table) {
            $table->dropColumn([
                'conveyance', 'house_rent', 'medical_allowance', 'supervision_allowance', 
                'construction_allowance', 'mobile_allowance', 'overtime_pay', 'snacks_allowance', 
                'gross_pay', 'advance_salary', 'loan_installment', 'total_leave_taken', 
                'leave_current_month', 'yearly_holidays', 'fund_source'
            ]);
        });
    }
};
