<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class EmployeeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $employees = [
            [
                'employee_id' => 'EMP-001',
                'first_name' => 'Pristia',
                'last_name' => 'Candra',
                'email' => 'pristia@example.com',
                'department' => 'Product Design',
                'designation' => 'Senior UI Designer',
                'status' => 'active',
                'join_date' => '2023-01-15',
            ],
            [
                'employee_id' => 'EMP-002',
                'first_name' => 'John',
                'last_name' => 'Doe',
                'email' => 'john.doe@example.com',
                'department' => 'Engineering',
                'designation' => 'Fullstack Developer',
                'status' => 'active',
                'join_date' => '2023-02-10',
            ],
            [
                'employee_id' => 'EMP-003',
                'first_name' => 'Sarah',
                'last_name' => 'Wilson',
                'email' => 'sarah.w@example.com',
                'department' => 'Marketing',
                'designation' => 'Brand Specialist',
                'status' => 'inactive',
                'join_date' => '2023-03-05',
            ],
            [
                'employee_id' => 'EMP-004',
                'first_name' => 'Michael',
                'last_name' => 'Brown',
                'email' => 'm.brown@example.com',
                'department' => 'Customer Success',
                'designation' => 'Team Lead',
                'status' => 'active',
                'join_date' => '2023-05-20',
            ],
            [
                'employee_id' => 'EMP-005',
                'first_name' => 'Elena',
                'last_name' => 'Rodriguez',
                'email' => 'elena.r@example.com',
                'department' => 'Human Resources',
                'designation' => 'HR Manager',
                'status' => 'active',
                'join_date' => '2023-06-12',
            ],
        ];

        foreach ($employees as $employee) {
            \App\Models\Employee::create($employee);
        }
    }
}
