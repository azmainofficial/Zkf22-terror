<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AutoAuthorize
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!auth()->check()) {
            return redirect()->route('login');
        }

        $user = auth()->user();

        // 1. Root-level administrators bypass all restrictions
        if ($user->isAdmin()) {
            return $next($request);
        }

        $routeName = $request->route() ? $request->route()->getName() : null;
        if (!$routeName) {
            return $next($request);
        }

        // 2. Bypass specific core authentication/profile pathways
        if (in_array($routeName, ['profile.edit', 'profile.update', 'profile.destroy', 'logout', 'login', 'notifications.read', 'notifications.read-all'])) {
            return $next($request);
        }

        if ($routeName === 'dashboard') {
            if (!$user->hasPermission('view_dashboard')) abort(403, 'Unauthorized module access.');
            return $next($request);
        }

        // 3. Auto-Map Route to Actions & Resources
        $parts = explode('.', $routeName);
        $targetResource = $parts[0];
        $targetAction = end($parts);

        // Sub-resource routing overrides for granular project access
        if (count($parts) >= 3 && $targetResource === 'projects') {
            if ($parts[1] === 'designs') $targetResource = 'project_designs';
            elseif ($parts[1] === 'documents') $targetResource = 'project_documents';
        }

        // Resource structural aliases
        $resourceMap = [
            'reports' => 'audit_logs',
            'audit-logs' => 'audit_logs',
            'expense-categories' => 'settings',
            'payment-methods' => 'settings',
            'brands' => 'settings',
            'units' => 'settings',
            'slip-designs' => 'settings',
            'designs' => 'projects',
            'leaves' => 'attendance',
            'holidays' => 'attendance',
            'performance' => 'employees',
            'tasks' => 'employees',
            'documents' => 'employees',
            'shifts' => 'attendance',
            'invoices' => 'payments',
            'finance' => 'payments',
            'expenses' => 'payroll', // Mapped to payroll based on active FigmaLayout structure
            'iclock' => 'attendance',
        ];

        if (array_key_exists($targetResource, $resourceMap)) {
            $targetResource = $resourceMap[$targetResource];
        }

        // Action verb translation
        $actionMap = [
            'index' => 'view', 'show' => 'view', 'calendar' => 'view', 'report' => 'view', 'sheet' => 'view', 'export' => 'view', 'excel' => 'view',
            'create' => 'create', 'store' => 'create', 'generate' => 'create', 'upload' => 'create', 'bulk' => 'create', 'add' => 'create', 'duplicate' => 'create',
            'edit' => 'edit', 'update' => 'edit', 'updateStatus' => 'edit', 'rename' => 'edit', 'replace' => 'edit', 'toggle' => 'edit', 'approve' => 'edit', 'reject' => 'edit', 'assign-role' => 'edit', 'remove-role' => 'edit', 'updateReview' => 'edit',
            'destroy' => 'delete', 'remove' => 'delete',
        ];

        $mappedAction = $actionMap[$targetAction] ?? 'view';
        $requiredPerm = "{$mappedAction}_{$targetResource}";

        // Support for generic manual bindings such as 'manage_roles' instead of view_roles...
        $fallbackPerm = "manage_{$targetResource}";

        if (!$user->hasPermission($requiredPerm) && !$user->hasPermission($fallbackPerm)) {
            if ($request->wantsJson()) {
                return response()->json(['message' => "Restricted Access: {$requiredPerm} required"], 403);
            }
            abort(403, "You do not have administrative clearance for this action. Role authorization required: {$requiredPerm}");
        }

        return $next($request);
    }
}
