<?php

namespace App\Http\Controllers;

use App\Models\AttendanceLog;
use App\Models\ZktecoDevice;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        if (!$request->user()->isAdmin() && !$request->user()->hasPermission('view_dashboard')) {
            abort(403, 'Unauthorized access to intelligence dashboard.');
        }

        $today = Carbon::today();
        $yesterday = Carbon::yesterday();
        $now = Carbon::now();
        $prevM = $now->copy()->subMonth();
        
        // ── Sales Intelligence Analytics ────────────────────────────────────
        $dailySales = [];
        for ($i = 14; $i >= 0; $i--) {
            $d = $today->copy()->subDays($i);
            $total = \App\Models\Payment::where('payment_type', 'incoming')
                ->where('status', 'completed')
                ->whereDate('payment_date', $d)
                ->sum('amount');
            $dailySales[] = [
                'label' => $d->format('d M'),
                'amount' => (float)$total,
            ];
        }

        $revenueData = \App\Models\Payment::selectRaw('MONTH(payment_date) as month, SUM(amount) as total')
            ->where('payment_type', 'incoming')->where('status', 'completed')
            ->whereYear('payment_date', $now->year)->groupBy('month')->orderBy('month')
            ->pluck('total', 'month')->toArray();

        $monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        $revenue_trend = [];
        foreach ($monthNames as $idx => $m) {
            $revenue_trend[] = ['month' => $m, 'revenue' => $revenueData[$idx + 1] ?? 0];
        }

        $currentRevenue = \App\Models\Payment::where('payment_type', 'incoming')->where('status', 'completed')
            ->whereMonth('payment_date', $now->month)->whereYear('payment_date', $now->year)->sum('amount');
        $prevRevenue = \App\Models\Payment::where('payment_type', 'incoming')->where('status', 'completed')
            ->whereMonth('payment_date', $prevM->month)->whereYear('payment_date', $prevM->year)->sum('amount');

        $todaySales = \App\Models\Payment::where('payment_type', 'incoming')->where('status', 'completed')
            ->whereDate('payment_date', $today)->sum('amount');
        $yesterdaySales = \App\Models\Payment::where('payment_type', 'incoming')->where('status', 'completed')
            ->whereDate('payment_date', $yesterday)->sum('amount');

        // ── Project & Activity ──────────────────────────────────────────────
        $projectCounts = \App\Models\Project::selectRaw('status, count(*) as count')->groupBy('status')->pluck('count', 'status')->toArray();
        $project_status = [
            ['name' => 'Completed', 'value' => $projectCounts['completed'] ?? 0],
            ['name' => 'Ongoing', 'value' => ($projectCounts['ongoing'] ?? 0) + ($projectCounts['in_progress'] ?? 0)],
            ['name' => 'Pending', 'value' => $projectCounts['pending'] ?? 0],
        ];

        $recent_activity = \App\Models\AuditLog::with('user')->latest()->take(10)->get()->map(function ($log) {
            return [
                'id' => $log->id,
                'user' => $log->user ? $log->user->name : 'System',
                'action' => $log->description,
                'time' => $log->created_at->diffForHumans(),
            ];
        });

        return Inertia::render('Dashboard', [
            'sales' => [
                'daily_analytics' => $dailySales,
                'monthly_revenue' => $currentRevenue,
                'today_revenue' => $todaySales,
                'revenue_trend' => $revenue_trend,
                'growth' => $this->calcChange($prevRevenue, $currentRevenue),
                'daily_growth' => $this->calcChange($yesterdaySales, $todaySales),
            ],
            'project_status' => $project_status,
            'recent_activity' => $recent_activity,
            'today_date' => $today->format('jS F Y'),
            'current_time' => $now->format('g:i:s A'),
        ]);
    }

    private function calcChange($prev, $current): string
    {
        if ($prev == 0) return $current > 0 ? '+100%' : '0%';
        $pct = round((($current - $prev) / $prev) * 100);
        return ($pct >= 0 ? '+' : '') . $pct . '%';
    }
}
