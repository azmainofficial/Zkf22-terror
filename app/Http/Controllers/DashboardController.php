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
        $now = Carbon::now();
        $prevM = $now->copy()->subMonth();
        $today = Carbon::today();

        // ── Device/Log Stats (ZKTeco) ─────────────────────────────────────────
        $totalDevices = ZktecoDevice::count();
        $activeDevicesCount = ZktecoDevice::where('last_seen_at', '>=', Carbon::now()->subMinutes(10))->count();
        $todayLogsCount = AttendanceLog::whereDate('timestamp', $today)->count();

        $recentLogs = AttendanceLog::with('device')
            ->orderBy('timestamp', 'desc')
            ->limit(10)
            ->get();

        $devices = ZktecoDevice::orderBy('last_seen_at', 'desc')->get();

        // ── Office Metrics (Reference Merge) ──────────────────────────────────
        $revenueData = \App\Models\Payment::selectRaw('MONTH(payment_date) as month, SUM(amount) as total')
            ->where('payment_type', 'incoming')
            ->where('status', 'completed')
            ->whereYear('payment_date', $now->year)
            ->groupBy('month')
            ->orderBy('month')
            ->pluck('total', 'month')
            ->toArray();

        $monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        $revenue_trend = [];
        foreach ($monthNames as $index => $month) {
            $revenue_trend[] = [
                'month' => $month,
                'revenue' => $revenueData[$index + 1] ?? 0,
            ];
        }

        $projectCounts = \App\Models\Project::selectRaw('status, count(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();

        $project_status = [
            ['name' => 'Completed', 'value' => $projectCounts['completed'] ?? 0],
            ['name' => 'Ongoing', 'value' => ($projectCounts['ongoing'] ?? 0) + ($projectCounts['in_progress'] ?? 0)],
            ['name' => 'Pending', 'value' => $projectCounts['pending'] ?? 0],
            ['name' => 'Cancelled', 'value' => $projectCounts['cancelled'] ?? 0],
        ];

        $recent_activity = \App\Models\AuditLog::with('user')
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($log) {
                return [
                    'id' => 'log-' . $log->id,
                    'user' => $log->user ? $log->user->name : 'System',
                    'action' => $log->description,
                    'time' => $log->created_at->diffForHumans(),
                ];
            });

        $currentRevenue = \App\Models\Payment::where('payment_type', 'incoming')
            ->where('status', 'completed')
            ->whereMonth('payment_date', $now->month)
            ->whereYear('payment_date', $now->year)
            ->sum('amount');

        $prevRevenue = \App\Models\Payment::where('payment_type', 'incoming')
            ->where('status', 'completed')
            ->whereMonth('payment_date', $prevM->month)
            ->whereYear('payment_date', $prevM->year)
            ->sum('amount');

        $currentExpense = \App\Models\Payment::where('payment_type', 'outgoing')
            ->where('status', 'completed')
            ->whereMonth('payment_date', $now->month)
            ->whereYear('payment_date', $now->year)
            ->sum('amount')
            + \App\Models\Expense::whereIn('status', ['approved', 'paid'])
                ->whereMonth('expense_date', $now->month)
                ->whereYear('expense_date', $now->year)
                ->sum('amount');

        $prevExpense = \App\Models\Payment::where('payment_type', 'outgoing')
            ->where('status', 'completed')
            ->whereMonth('payment_date', $prevM->month)
            ->whereYear('payment_date', $prevM->year)
            ->sum('amount')
            + \App\Models\Expense::whereIn('status', ['approved', 'paid'])
                ->whereMonth('expense_date', $prevM->month)
                ->whereYear('expense_date', $prevM->year)
                ->sum('amount');

        $currentProjects = \App\Models\Project::whereMonth('created_at', $now->month)->whereYear('created_at', $now->year)->count();
        $prevProjects = \App\Models\Project::whereMonth('created_at', $prevM->month)->whereYear('created_at', $prevM->year)->count();

        return Inertia::render('Dashboard', [
            'stats' => [
                'totalDevices' => $totalDevices,
                'activeDevices' => $activeDevicesCount,
                'todayLogs' => $todayLogsCount,
                'total_projects' => \App\Models\Project::count(),
                'active_employees' => \App\Models\Employee::where('status', 'active')->count(),
                'monthly_revenue' => $currentRevenue ?? 0,
                'monthly_expense' => $currentExpense,
                'monthly_payroll' => \App\Models\Employee::where('status', 'active')->sum('salary'),
                'pending_approvals' => \App\Models\Expense::where('status', 'pending')->count(),
                'revenue_change' => $this->calcChange($prevRevenue, $currentRevenue),
                'expense_change' => $this->calcChange($prevExpense, $currentExpense),
                'projects_change' => $this->calcChange($prevProjects, $currentProjects),
            ],
            'recentLogs' => $recentLogs,
            'devices' => $devices,
            'recent_activity' => $recent_activity,
            'project_status' => $project_status,
            'revenue_trend' => $revenue_trend,
        ]);
    }

    private function calcChange($prev, $current): string
    {
        if ($prev == 0) {
            return $current > 0 ? '+100%' : '0%';
        }
        $pct = round((($current - $prev) / $prev) * 100);
        return ($pct >= 0 ? '+' : '') . $pct . '%';
    }
}
