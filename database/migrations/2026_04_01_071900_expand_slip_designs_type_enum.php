<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // MySQL requires a raw ALTER to expand an ENUM column
        DB::statement("ALTER TABLE slip_designs MODIFY COLUMN type ENUM('invoice','payment','payroll','expense','project','report') NOT NULL");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE slip_designs MODIFY COLUMN type ENUM('invoice','payment') NOT NULL");
    }
};
