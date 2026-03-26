<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use App\Models\PaymentMethod;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class SettingController extends Controller
{
    public function index()
    {
        return Inertia::render('Settings/Index', [
            'settings' => [
                'app_name' => Setting::get('app_name', config('app.name')),
                'app_logo' => Setting::get('app_logo'),
            ],
            'paymentMethods' => PaymentMethod::all()
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'app_name' => 'required|string|max:255',
            'app_logo' => 'nullable|image|max:2048',
        ]);

        Setting::set('app_name', $request->app_name);

        if ($request->hasFile('app_logo')) {
            // Delete old logo
            $oldLogo = Setting::get('app_logo');
            if ($oldLogo) {
                Storage::disk('public')->delete($oldLogo);
            }

            $path = $request->file('app_logo')->store('settings', 'public');
            Setting::set('app_logo', $path);
        }

        return back()->with('success', 'Settings updated successfully.');
    }
}
