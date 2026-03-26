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
        Schema::table('clients', function (Blueprint $table) {
            $table->string('vat_number')->nullable()->after('company_name');
            $table->string('industry')->nullable()->after('vat_number');
            $table->string('logo')->nullable()->after('avatar');
            $table->string('linkedin')->nullable()->after('website');
            $table->string('facebook')->nullable()->after('linkedin');
            $table->string('twitter')->nullable()->after('facebook');
            $table->string('instagram')->nullable()->after('twitter');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('clients', function (Blueprint $table) {
            $table->dropColumn(['vat_number', 'industry', 'logo', 'linkedin', 'facebook', 'twitter', 'instagram']);
        });
    }
};
