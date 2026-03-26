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
        Schema::table('employees', function (Blueprint $table) {
            $table->decimal('salary', 15, 2)->default(0)->after('designation');
            $table->text('address')->nullable()->after('salary');
            $table->string('avatar')->nullable()->after('address');
            $table->date('joining_date')->nullable()->after('join_date');

            // From reference upgrade migration
            $table->date('date_of_birth')->nullable()->after('last_name');
            $table->enum('gender', ['male', 'female', 'other'])->nullable()->after('date_of_birth');
            $table->string('blood_group')->nullable()->after('gender');
            $table->string('emergency_contact_name')->nullable()->after('phone');
            $table->string('emergency_contact_phone')->nullable()->after('emergency_contact_name');
            $table->text('skills')->nullable()->after('designation');
            $table->text('education')->nullable()->after('skills');
            $table->string('bank_account_no')->nullable()->after('salary');
            $table->string('bank_name')->nullable()->after('bank_account_no');
            $table->string('official_id_type')->nullable()->after('employee_id');
            $table->string('official_id_number')->nullable()->after('official_id_type');
            $table->text('job_description')->nullable()->after('designation');
            $table->text('bio')->nullable()->after('avatar');

            $table->softDeletes();
        });

        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'deleted_at')) {
                $table->softDeletes();
            }
        });

        // New HR Tables consolidation
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

        if (!Schema::hasTable('leave_applications')) {
            Schema::create('leave_applications', function (Blueprint $table) {
                $table->id();
                $table->foreignId('employee_id')->constrained()->onDelete('cascade');
                $table->enum('leave_type', ['casual', 'sick', 'annual', 'maternity', 'paternity', 'unpaid', 'other'])->default('casual');
                $table->date('start_date');
                $table->date('end_date');
                $table->text('reason')->nullable();
                $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
                $table->foreignId('approved_by')->nullable()->constrained('users')->onDelete('set null');
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('tasks')) {
            Schema::create('tasks', function (Blueprint $table) {
                $table->id();
                $table->foreignId('employee_id')->constrained()->onDelete('cascade');
                $table->foreignId('creator_id')->constrained('users')->onDelete('cascade');
                $table->string('title');
                $table->text('description')->nullable();
                $table->enum('priority', ['low', 'medium', 'high', 'urgent'])->default('medium');
                $table->date('due_date')->nullable();
                $table->enum('status', ['pending', 'in_progress', 'completed', 'cancelled'])->default('pending');
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('performance_reviews')) {
            Schema::create('performance_reviews', function (Blueprint $table) {
                $table->id();
                $table->foreignId('employee_id')->constrained()->onDelete('cascade');
                $table->foreignId('reviewer_id')->constrained('users')->onDelete('cascade');
                $table->date('review_date');
                $table->integer('rating')->default(3); // 1-5
                $table->decimal('kpi_score', 5, 2)->default(0);
                $table->text('comments')->nullable();
                $table->text('goals')->nullable();
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('employees', function (Blueprint $table) {
            $table->dropColumn([
                'salary',
                'address',
                'avatar',
                'joining_date',
                'date_of_birth',
                'gender',
                'blood_group',
                'emergency_contact_name',
                'emergency_contact_phone',
                'skills',
                'education',
                'bank_account_no',
                'bank_name',
                'official_id_type',
                'official_id_number',
                'job_description',
                'bio'
            ]);
            $table->dropSoftDeletes();
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });

        Schema::dropIfExists('performance_reviews');
        Schema::dropIfExists('tasks');
        Schema::dropIfExists('leave_applications');
        Schema::dropIfExists('attendances');
    }
};
