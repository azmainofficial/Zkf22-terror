<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class LogActivity
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        if (auth()->check() && in_array($request->method(), ['POST', 'PUT', 'PATCH', 'DELETE'])) {
            $actionMap = [
                'POST' => 'Created',
                'PUT' => 'Updated',
                'PATCH' => 'Modified',
                'DELETE' => 'Deleted'
            ];
            
            $action = $actionMap[$request->method()] ?? 'Executed';
            $path = ltrim($request->path(), '/');

            // Exclude non-database spam or extreme payloads if necessary, but keep it solid
            \App\Models\AuditLog::create([
                'user_id' => auth()->id(),
                'action' => $action,
                'auditable_type' => \App\Models\User::class,
                'auditable_id' => auth()->id() ?? 0,
                'description' => "User {$action} data via /{$path}",
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'new_values' => $request->except(['password', 'password_confirmation', '_token', '_method', 'files', 'documents', 'image', 'photo']),
            ]);
        }

        return $response;
    }
}
