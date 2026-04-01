<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('slip_designs', function (Blueprint $table) {
            if (!Schema::hasColumn('slip_designs', 'company_name')) {
                $table->string('company_name')->nullable()->after('footer_text');
            }
            if (!Schema::hasColumn('slip_designs', 'company_address')) {
                $table->string('company_address', 500)->nullable()->after('company_name');
            }
            if (!Schema::hasColumn('slip_designs', 'company_tagline')) {
                $table->string('company_tagline')->nullable()->after('company_address');
            }
            if (!Schema::hasColumn('slip_designs', 'show_signature_lines')) {
                $table->boolean('show_signature_lines')->default(false)->after('company_tagline');
            }
            if (!Schema::hasColumn('slip_designs', 'show_bank_details')) {
                $table->boolean('show_bank_details')->default(false)->after('show_signature_lines');
            }
            if (!Schema::hasColumn('slip_designs', 'bank_details')) {
                $table->text('bank_details')->nullable()->after('show_bank_details');
            }
        });
    }

    public function down(): void
    {
        Schema::table('slip_designs', function (Blueprint $table) {
            $table->dropColumn([
                'company_name', 'company_address', 'company_tagline',
                'show_signature_lines', 'show_bank_details', 'bank_details'
            ]);
        });
    }
};
