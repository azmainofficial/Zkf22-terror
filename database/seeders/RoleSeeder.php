<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    public function run()
    {
        $permissions = [
            // RBAC
            ['name' => 'manage_roles', 'display_name' => 'Manage Roles', 'group' => 'system'],
            ['name' => 'manage_users', 'display_name' => 'Manage Users', 'group' => 'system'],
            ['name' => 'view_audit_logs', 'display_name' => 'View Audit Logs', 'group' => 'system'],
            
            // Other features
            ['name' => 'manage_settings', 'display_name' => 'Manage Settings', 'group' => 'system'],
        ];

        foreach ($permissions as $perm) {
            Permission::firstOrCreate(
                ['name' => $perm['name']],
                [
                    'display_name' => $perm['display_name'], 
                    'group' => $perm['group'],
                    'description' => 'Can ' . strtolower($perm['display_name'])
                ]
            );
        }

        $adminRole = Role::firstOrCreate(
            ['name' => 'admin'],
            [
                'display_name' => 'System Administrator',
                'description' => 'Full access to all system features',
                'is_system' => true
            ]
        );

        // Assign all permissions to admin role
        $adminRole->permissions()->sync(Permission::all());

        // Assign admin role to first user
        $firstUser = User::first();
        if ($firstUser) {
            $firstUser->assignRole($adminRole);
        }
        
        $adminEmail = User::where('email', 'admin@admin.com')->first();
        if ($adminEmail) {
            $adminEmail->assignRole($adminRole);
        }
    }
}
