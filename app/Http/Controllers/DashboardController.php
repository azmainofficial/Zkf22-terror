<?php

namespace App\Http\Controllers;

use App\Models\AttendanceLog;
use App\Models\ZktecoDevice;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $today = Carbon::today();

        // Stats
        $totalDevices = ZktecoDevice::count();
        $activeDevicesCount = ZktecoDevice::where('last_seen_at', '>=', Carbon::now()->subMinutes(10))->count();
        $todayLogsCount = AttendanceLog::whereDate('timestamp', $today)->count();
        
        // Recent Logs
        $recentLogs = AttendanceLog::with('device')
            ->orderBy('timestamp', 'desc')
            ->limit(10)
            ->get();

        // Device Status List
        $devices = ZktecoDevice::orderBy('last_seen_at', 'desc')->get();

        return Inertia::render('Dashboard', [
            'stats' => [
                'totalDevices' => $totalDevices,
                'activeDevices' => $activeDevicesCount,
                'todayLogs' => $todayLogsCount,
            ],
            'recentLogs' => $recentLogs,
            'devices' => $devices,
        ]);
    }
}
