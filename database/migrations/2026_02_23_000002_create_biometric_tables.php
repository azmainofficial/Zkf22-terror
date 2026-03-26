<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration 
{
    public function up(): void
    {
        // Biometric device registry
        Schema::create('biometric_devices', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // e.g. "Main Office Entrance"
            $table->string('serial_number')->unique(); // Device serial from ZKTeco
            $table->string('ip_address')->nullable(); // Static IP of device
            $table->integer('port')->default(4370); // ZKTeco default TCP port
            $table->string('location')->nullable(); // Physical location label
            $table->string('model')->default('ZKTeco F22'); // Device model
            $table->boolean('is_active')->default(true);
            $table->timestamp('last_sync_at')->nullable(); // Last successful data pull
            $table->timestamps();
        });

        // Raw attendance logs pushed from device (ADMS protocol)
        Schema::create('biometric_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('biometric_device_id')->constrained()->cascadeOnDelete();
            $table->string('device_user_id'); // The enrollment ID on device
            $table->foreignId('employee_id')->nullable()->constrained()->nullOnDelete();
            $table->timestamp('punch_time'); // Exact time from device
            $table->tinyInteger('punch_type')->default(0); // 0=check-in, 1=check-out, 2=break, etc.
            $table->tinyInteger('verify_type')->default(1); // 1=fingerprint, 2=card, 3=password, 15=face
            $table->boolean('processed')->default(false); // Whether this has been converted to attendance
            $table->timestamps();

            $table->unique(['device_user_id', 'punch_time', 'biometric_device_id'], 'bio_log_unique'); // prevent duplicates
        });

        // Employee – biometric enrollment mapping
        Schema::create('employee_biometric_enrollments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained()->cascadeOnDelete();
            $table->foreignId('biometric_device_id')->constrained()->cascadeOnDelete();
            $table->string('device_user_id'); // The user ID enrolled on the device
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->unique(['device_user_id', 'biometric_device_id'], 'bio_enroll_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employee_biometric_enrollments');
        Schema::dropIfExists('biometric_logs');
        Schema::dropIfExists('biometric_devices');
    }
};
