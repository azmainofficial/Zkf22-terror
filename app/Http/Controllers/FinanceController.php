<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class FinanceController extends Controller
{
    public function index()
    {
        $totalInvoiced = \App\Models\Invoice::sum('total_amount');
        $totalPaid = \App\Models\Payment::sum('amount');
        $totalExpenses = \App\Models\Expense::where('status', 'approved')->sum('amount');

        $pendingInvoicesCount = \App\Models\Invoice::where('status', '!=', 'paid')->count();
        $recentInvoices = \App\Models\Invoice::with('client')->latest()->take(5)->get();
        $recentExpenses = \App\Models\Expense::with('category')->latest()->take(5)->get();
        $recentPayments = \App\Models\Payment::with(['invoice.client'])->latest()->take(5)->get();

        return Inertia::render('Finance/Index', [
            'stats' => [
                'total_invoiced' => $totalInvoiced,
                'total_paid' => $totalPaid,
                'total_expenses' => $totalExpenses,
                'net_balance' => $totalPaid - $totalExpenses,
                'pending_invoices_count' => $pendingInvoicesCount,
            ],
            'recent_invoices' => $recentInvoices,
            'recent_expenses' => $recentExpenses,
            'recent_payments' => $recentPayments,
        ]);
    }
}
