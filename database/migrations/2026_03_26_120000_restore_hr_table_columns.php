<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // Restore leave_applications columns (table exists but is empty shell)
        Schema::table('leave_applications', function (Blueprint $table) {
            if (!Schema::hasColumn('leave_applications', 'employee_id')) {
                $table->foreignId('employee_id')->after('id')->constrained()->onDelete('cascade');
            }
            if (!Schema::hasColumn('leave_applications', 'leave_type')) {
                $table->enum('leave_type', ['casual', 'sick', 'annual', 'maternity', 'paternity', 'unpaid', 'other'])
                    ->default('casual')->after('employee_id');
            }
            if (!Schema::hasColumn('leave_applications', 'start_date')) {
                $table->date('start_date')->after('leave_type');
            }
            if (!Schema::hasColumn('leave_applications', 'end_date')) {
                $table->date('end_date')->after('start_date');
            }
            if (!Schema::hasColumn('leave_applications', 'reason')) {
                $table->text('reason')->nullable()->after('end_date');
            }
            if (!Schema::hasColumn('leave_applications', 'status')) {
                $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending')->after('reason');
            }
            if (!Schema::hasColumn('leave_applications', 'approved_by')) {
                $table->foreignId('approved_by')->nullable()->constrained('users')->onDelete('set null')->after('status');
            }
        });

        // Restore tasks columns (table exists but is empty shell)
        Schema::table('tasks', function (Blueprint $table) {
            if (!Schema::hasColumn('tasks', 'employee_id')) {
                $table->foreignId('employee_id')->after('id')->constrained()->onDelete('cascade');
            }
            if (!Schema::hasColumn('tasks', 'creator_id')) {
                $table->foreignId('creator_id')->after('employee_id')->constrained('users')->onDelete('cascade');
            }
            if (!Schema::hasColumn('tasks', 'title')) {
                $table->string('title')->after('creator_id');
            }
            if (!Schema::hasColumn('tasks', 'description')) {
                $table->text('description')->nullable()->after('title');
            }
            if (!Schema::hasColumn('tasks', 'priority')) {
                $table->enum('priority', ['low', 'medium', 'high', 'urgent'])->default('medium')->after('description');
            }
            if (!Schema::hasColumn('tasks', 'due_date')) {
                $table->date('due_date')->nullable()->after('priority');
            }
            if (!Schema::hasColumn('tasks', 'status')) {
                $table->enum('status', ['pending', 'in_progress', 'completed', 'cancelled'])->default('pending')->after('due_date');
            }
        });

        // Ensure attendances table exists and has all columns
        if (!Schema::hasTable('attendances')) {
            Schema::create('attendances', function (Blueprint $table) {
                $table->id();
                $table->foreignId('employee_id')->constrained()->onDelete('cascade');
                $table->date('date');
                $table->time('clock_in')->nullable();
                $table->time('clock_out')->nullable();
                $table->enum('status', ['present', 'absent', 'late', 'early_leave', 'on_leave'])->default('present');
                $table->text('note')->nullable();
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        // Non-destructive rollback - just remove added columns
        Schema::table('leave_applications', function (Blueprint $table) {
            $columns = ['approved_by', 'status', 'reason', 'end_date', 'start_date', 'leave_type', 'employee_id'];
            foreach ($columns as $col) {
                if (Schema::hasColumn('leave_applications', $col)) {
                    $table->dropColumn($col);
                }
            }
        });

        Schema::table('tasks', function (Blueprint $table) {
            $columns = ['status', 'due_date', 'priority', 'description', 'title', 'creator_id', 'employee_id'];
            foreach ($columns as $col) {
                if (Schema::hasColumn('tasks', $col)) {
                    $table->dropColumn($col);
                }
            }
        });
    }
};
