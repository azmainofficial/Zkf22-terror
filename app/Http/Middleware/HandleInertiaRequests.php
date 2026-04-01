<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): string|null
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
                'permissions' => $request->user() ? $request->user()->roles()->with('permissions')->get()->pluck('permissions')->flatten()->unique('name')->pluck('name')->toArray() : [],
                'is_admin' => $request->user() ? $request->user()->isAdmin() : false,
                'notifications' => $request->user() ? $request->user()->notifications()->latest()->limit(5)->get() : [],
                'unread_count' => $request->user() ? $request->user()->unreadNotifications()->count() : 0,
            ],
            'settings' => [
                'app_name' => \App\Models\Setting::get('app_name', config('app.name')),
                'app_logo' => \App\Models\Setting::get('app_logo'),
            ],
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ],
        ];
    }
}
