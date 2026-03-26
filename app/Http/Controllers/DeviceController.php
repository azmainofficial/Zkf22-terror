<?php

namespace App\Http\Controllers;

use App\Models\ZktecoDevice;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DeviceController extends Controller
{
    /**
     * Display a listing of the devices.
     */
    public function index()
    {
        $devices = ZktecoDevice::all()->map(function ($device) {
            // Status is "Online" if last seen within 2 minutes
            $device->is_online = $device->last_seen_at && $device->last_seen_at->isAfter(now()->subMinutes(2));
            return $device;
        });

        return Inertia::render('Devices/Index', [
            'devices' => $devices
        ]);
    }

    /**
     * Update the specified device in storage.
     */
    public function update(Request $request, ZktecoDevice $device)
    {
        $request->validate([
            'device_name' => 'required|string|max:255',
        ]);

        $device->update([
            'device_name' => $request->device_name
        ]);

        return redirect()->back()->with('message', 'Device location updated successfully!');
    }
}
