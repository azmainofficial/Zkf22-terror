<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;


use App\Models\ZktecoDevice;
use App\Models\AttendanceLog;
use Carbon\Carbon;

class ZktecoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $device = ZktecoDevice::updateOrCreate(
            ['serial_number' => 'BMZ202612345'],
            [
                'device_name' => 'Main Office F22',
                'ip_address' => '192.168.1.100',
                'last_seen_at' => now(),
            ]
        );

        $users = ['101', '102', '103'];
        foreach ($users as $userId) {
            for ($i = 0; $i < 5; $i++) {
                AttendanceLog::create([
                    'zkteco_device_id' => $device->id,
                    'user_id' => $userId,
                    'timestamp' => Carbon::now()->subDays($i)->subHours(rand(1, 8)),
                    'state' => rand(0, 1),
                    'raw_data' => "Dummy log for user $userId",
                ]);
            }
        }
    }
}
