<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;

class GranularPermissionSeeder extends Seeder
{
    public function run()
    {
        $resources = [
            'dashboard' => 'Dashboard Overview',
            'employees' => 'Team Members',
            'attendance' => 'Attendance Tracker',
            'payroll' => 'Financial Payroll',
            'inventory' => 'Resource Inventory',
            'projects' => 'Operational Projects',
            'payments' => 'Transaction Payments',
            'clients' => 'System Clients',
            'suppliers' => 'Project Suppliers',
            'audit_logs' => 'Audit Trails',
            'users' => 'User Management',
            'roles' => 'Access Permissions',
            'settings' => 'System Configuration',
        ];

        $actions = [
            'view' => 'Can View',
            'create' => 'Can Create',
            'edit' => 'Can Update',
            'delete' => 'Can Remove',
        ];

        foreach ($resources as $resKey => $resTitle) {
            foreach ($actions as $actKey => $actTitle) {
                // Determine if this action is applicable (e.g. view only for some)
                if ($resKey === 'dashboard' && $actKey !== 'view') continue;
                if ($resKey === 'audit_logs' && ($actKey !== 'view' && $actKey !== 'delete')) continue;

                $permName = "{$actKey}_{$resKey}";
                $permDisplay = "{$actTitle} {$resTitle}";
                
                Permission::updateOrCreate(
                    ['name' => $permName],
                    [
                        'display_name' => $permDisplay,
                        'group' => $resKey, // Group by resource key
                        'description' => "Enables user to " . strtolower($actTitle) . " " . strtolower($resTitle) . "."
                    ]
                );
            }
        }

        // Ensure Admin has all permissions
        $admin = Role::where('name', 'admin')->first();
        if ($admin) {
            $admin->permissions()->sync(Permission::all());
        }
    }
}
