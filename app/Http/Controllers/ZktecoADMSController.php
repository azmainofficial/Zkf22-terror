<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;


use App\Models\ZktecoDevice;
use App\Models\AttendanceLog;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ZktecoADMSController extends Controller
{
    public function index(Request $request)
    {
        $query = AttendanceLog::with(['device', 'employee.shift']);

        if ($request->has('search')) {
            $query->where('user_id', 'like', '%' . $request->search . '%')
                  ->orWhereHas('employee', function($q) use ($request) {
                      $q->where('first_name', 'like', '%' . $request->search . '%')
                        ->orWhere('last_name', 'like', '%' . $request->search . '%');
                  });
        }

        if ($request->has('date')) {
            $query->whereDate('timestamp', $request->date);
        }

        return Inertia::render('Attendance/Index', [
            'logs' => $query->latest()->paginate(20)->withQueryString(),
            'filters' => $request->only(['search', 'date'])
        ]);
    }

    /**
     * Handle the device's main data communication (handshake and log upload).
     */
    public function handleCData(Request $request)
    {
        $sn = $request->query('SN');
        $table = $request->query('table');

        if (!$sn) {
            return response("OK", 200);
        }

        // Register or update device
        $device = ZktecoDevice::firstOrCreate(['serial_number' => $sn]);
        $device->last_seen_at = now();
        $device->save();

        // Handle GET (Handshake/Registry)
        if ($request->isMethod('get')) {
            return response("OK", 200)->header('Content-Type', 'text/plain');
        }

        // Handle POST (Data Upload)
        $content = $request->getContent();
        
        if ($table === 'ATTLOG') {
            $lines = explode("\n", trim($content));
            foreach ($lines as $line) {
                if (empty(trim($line))) continue;
                
                $data = preg_split('/\s+/', trim($line));
                if (count($data) >= 2) {
                    AttendanceLog::create([
                        'zkteco_device_id' => $device->id,
                        'user_id' => $data[0],
                        'timestamp' => $data[1] . ' ' . ($data[2] ?? '00:00:00'),
                        'state' => $data[3] ?? 0,
                        'raw_data' => $line
                    ]);
                }
            }
        }

        return response("OK", 200)->header('Content-Type', 'text/plain');
    }

    /**
     * Handle device command requests (polling).
     */
    public function handleGetRequest(Request $request)
    {
        // For now, always respond with OK to keep the heartbeat alive
        return response("OK", 200)->header('Content-Type', 'text/plain');
    }
}
