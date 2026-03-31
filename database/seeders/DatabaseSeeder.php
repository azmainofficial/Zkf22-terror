<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Global Administrator Account
        \App\Models\User::updateOrCreate(
            ['email' => 'admin@admin.com'],
            [
                'name' => 'System Admin',
                'password' => bcrypt('password'),
            ]
        );

        // Required Role & Permission Initialization
        $this->call(RoleSeeder::class);
    }
}
