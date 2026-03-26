<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class LogActivity
{
    /**
     * Handle an incoming request.
     * Logs all authenticated user activity (method + URL) to the Laravel log.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Only log for authenticated users on state-changing requests
        if (auth()->check() && in_array($request->method(), ['POST', 'PUT', 'PATCH', 'DELETE'])) {
            Log::info('User activity', [
                'user_id' => auth()->id(),
                'user_email' => auth()->user()->email,
                'method' => $request->method(),
                'url' => $request->fullUrl(),
                'ip' => $request->ip(),
                'status' => $response->getStatusCode(),
            ]);
        }

        return $response;
    }
}
