<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckPermission
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string  $permission  Permission name or comma-separated list
     * @param  string  $guard  Guard to use (default: web)
     */
    public function handle(Request $request, Closure $next, string $permission, string $guard = 'web'): Response
    {
        if (!auth($guard)->check()) {
            return redirect()->route('login')->with('error', 'Please login to continue.');
        }

        $user = auth($guard)->user();

        // Support multiple permissions separated by |
        $permissions = explode('|', $permission);

        $hasPermission = false;
        foreach ($permissions as $perm) {
            if ($user->hasPermission(trim($perm))) {
                $hasPermission = true;
                break;
            }
        }

        if (!$hasPermission) {
            abort(403, 'You do not have permission to access this resource.');
        }

        return $next($request);
    }
}
