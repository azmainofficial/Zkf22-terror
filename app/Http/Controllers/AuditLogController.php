<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Response;

class AuditLogController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = AuditLog::with('user');

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('description', 'like', '%' . $request->search . '%')
                    ->orWhere('auditable_type', 'like', '%' . $request->search . '%')
                    ->orWhere('action', 'like', '%' . $request->search . '%');
            });
        }

        if ($request->filled('action')) {
            $query->where('action', $request->action);
        }

        if ($request->filled('type')) {
            $query->where('auditable_type', $request->type);
        }

        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        if ($request->filled('start_date')) {
            $query->whereDate('created_at', '>=', $request->start_date);
        }

        if ($request->filled('end_date')) {
            $query->whereDate('created_at', '<=', $request->end_date);
        }

        $logs = $query->latest()->paginate(20)->withQueryString();

        // Get distinct actions and types for filters
        $actions = AuditLog::select('action')->distinct()->pluck('action');
        $types = AuditLog::select('auditable_type')->distinct()->pluck('auditable_type');

        return Inertia::render('AuditLogs/Index', [
            'logs' => $logs,
            'actions' => $actions,
            'types' => $types,
            'filters' => $request->only(['search', 'action', 'type', 'user_id', 'start_date', 'end_date']),
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        // Using $id manually to accept whatever route param is passed (likely 'audit_log' or 'id')
        $auditLog = AuditLog::with('user')->findOrFail($id);

        return Inertia::render('AuditLogs/Show', [
            'log' => $auditLog,
        ]);
    }

    /**
     * Export the filtered logs to CSV.
     */
    public function export(Request $request)
    {
        $query = AuditLog::with('user');

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('description', 'like', '%' . $request->search . '%')
                    ->orWhere('auditable_type', 'like', '%' . $request->search . '%')
                    ->orWhere('action', 'like', '%' . $request->search . '%');
            });
        }

        if ($request->filled('action')) {
            $query->where('action', $request->action);
        }

        if ($request->filled('type')) {
            $query->where('auditable_type', $request->type);
        }

        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        if ($request->filled('start_date')) {
            $query->whereDate('created_at', '>=', $request->start_date);
        }

        if ($request->filled('end_date')) {
            $query->whereDate('created_at', '<=', $request->end_date);
        }

        $logs = $query->latest()->get();

        $csvFileName = 'audit-logs-' . date('Y-m-d') . '.csv';
        $headers = [
            "Content-type" => "text/csv",
            "Content-Disposition" => "attachment; filename=$csvFileName",
            "Pragma" => "no-cache",
            "Cache-Control" => "must-revalidate, post-check=0, pre-check=0",
            "Expires" => "0"
        ];

        $callback = function () use ($logs) {
            $file = fopen('php://output', 'w');
            fputcsv($file, ['ID', 'User', 'Action', 'Item Type', 'Item ID', 'Description', 'IP Address', 'Date']);

            foreach ($logs as $log) {
                fputcsv($file, [
                    $log->id,
                    $log->user ? $log->user->name : 'System',
                    $log->action,
                    $log->auditable_type,
                    $log->auditable_id,
                    $log->description,
                    $log->ip_address,
                    $log->created_at,
                ]);
            }

            fclose($file);
        };

        return Response::stream($callback, 200, $headers);
    }
}
