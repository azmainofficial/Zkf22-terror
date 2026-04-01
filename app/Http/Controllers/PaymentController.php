<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Invoice;
use App\Models\Client;
use App\Models\Expense;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class PaymentController extends Controller
{
    public function exportToExcel(Request $request)
    {
        $query = Payment::with(['invoice', 'client']);

        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('payment_number', 'like', "%{$search}%")
                    ->orWhere('reference_number', 'like', "%{$search}%")
                    ->orWhereHas('client', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%");
                    });
            });
        }

        if ($request->has('payment_type') && $request->payment_type) {
            $query->where('payment_type', $request->payment_type);
        }

        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        if ($request->has('from_date') && $request->from_date) {
            $query->whereDate('payment_date', '>=', $request->from_date);
        }
        if ($request->has('to_date') && $request->to_date) {
            $query->whereDate('payment_date', '<=', $request->to_date);
        }

        $payments = $query->latest('payment_date')->get();

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="payments_export_' . date('Y-m-d_H-i-s') . '.csv"',
            'Pragma' => 'no-cache',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0'
        ];

        $columns = ['Date', 'Payment Number', 'Client', 'Amount', 'Type', 'Method', 'Status', 'Reference', 'Notes'];

        $callback = function () use ($payments, $columns) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $columns);

            foreach ($payments as $payment) {
                fputcsv($file, [
                    \Carbon\Carbon::parse($payment->payment_date)->format('Y-m-d'),
                    $payment->payment_number,
                    $payment->client ? $payment->client->name : 'N/A',
                    $payment->amount,
                    ucfirst($payment->payment_type),
                    ucfirst(str_replace('_', ' ', $payment->payment_method)),
                    ucfirst($payment->status),
                    $payment->reference_number,
                    $payment->notes
                ]);
            }
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    public function exportPaymentToExcel(Payment $payment)
    {
        $payment->load('client');

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="payment_' . $payment->payment_number . '.csv"',
        ];

        $columns = ['Date', 'Payment Number', 'Client', 'Amount', 'Type', 'Method', 'Status', 'Reference', 'Notes'];

        $callback = function () use ($payment, $columns) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $columns);

            fputcsv($file, [
                \Carbon\Carbon::parse($payment->payment_date)->format('Y-m-d'),
                $payment->payment_number,
                $payment->client ? $payment->client->name : 'N/A',
                $payment->amount,
                ucfirst($payment->payment_type),
                ucfirst(str_replace('_', ' ', $payment->payment_method)),
                ucfirst($payment->status),
                $payment->reference_number,
                $payment->notes
            ]);

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    public function index(Request $request)
    {
        $paymentsQuery = Payment::query()
            ->selectRaw("
                id, 
                payment_number as transaction_number, 
                payment_date as date, 
                amount, 
                payment_type as type, 
                status, 
                payment_method, 
                client_id, 
                project_id, 
                invoice_id, 
                notes,
                NULL as expense_category_id, 
                'payment' as source,
                created_at
            ")
            ->with(['client:id,name,company_name', 'project:id,title', 'invoice:id,invoice_number']);

        $expensesQuery = Expense::query()
            ->selectRaw("
                id, 
                expense_number as transaction_number, 
                expense_date as date, 
                amount, 
                'outgoing' as type, 
                status, 
                payment_method, 
                NULL as client_id, 
                project_id, 
                NULL as invoice_id, 
                expense_category_id, 
                description as notes,
                'expense' as source,
                created_at
            ")
            ->with(['project:id,title', 'category:id,name']);

        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $paymentsQuery->where(function ($q) use ($search) {
                $q->where('payment_number', 'like', "%{$search}%")
                    ->orWhereHas('client', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%");
                    });
            });

            $expensesQuery->where(function ($q) use ($search) {
                $q->where('expense_number', 'like', "%{$search}%")
                    ->orWhere('title', 'like', "%{$search}%");
            });
        }

        if ($request->has('payment_type') && $request->payment_type) {
            $paymentsQuery->where('payment_type', $request->payment_type);
            if ($request->payment_type !== 'outgoing') {
                $expensesQuery->whereRaw('1 = 0');
            }
        }

        if ($request->has('status') && $request->status) {
            $paymentsQuery->where('status', $request->status);
            $expensesQuery->where('status', $request->status);
        }

        if ($request->has('from_date') && $request->from_date) {
            $paymentsQuery->whereDate('payment_date', '>=', $request->from_date);
            $expensesQuery->whereDate('expense_date', '>=', $request->from_date);
        }

        if ($request->has('to_date') && $request->to_date) {
            $paymentsQuery->whereDate('payment_date', '<=', $request->to_date);
            $expensesQuery->whereDate('expense_date', '<=', $request->to_date);
        }

        $total_incoming = (clone $paymentsQuery)->where('payment_type', 'incoming')->where('status', 'completed')->sum('amount');
        $payment_outgoing = (clone $paymentsQuery)->where('payment_type', 'outgoing')->where('status', 'completed')->sum('amount');
        $expense_outgoing = (clone $expensesQuery)->where('status', 'paid')->sum('amount');

        $total_outgoing = $payment_outgoing + $expense_outgoing;

        $payments = $paymentsQuery->get();
        $expenses = $expensesQuery->get();

        $merged = $payments->concat($expenses)
            ->sortByDesc(function ($item) {
                // Sort by created_at timestamp desc (newest entry first)
                $createdAt = $item->created_at ? \Carbon\Carbon::parse($item->created_at)->timestamp : 0;
                $date      = $item->date       ? \Carbon\Carbon::parse($item->date)->timestamp       : 0;
                // Primary: payment/expense date desc, Secondary: created_at desc
                return $date * 1000000 + $createdAt;
            });

        $page = $request->input('page', 1);
        $perPage = 15;
        $sliced = $merged->slice(($page - 1) * $perPage, $perPage)->values();

        $paginated = new \Illuminate\Pagination\LengthAwarePaginator(
            $sliced,
            $merged->count(),
            $perPage,
            $page,
            ['path' => $request->url(), 'query' => $request->query()]
        );

        return Inertia::render('Finance/Payments/Index', [
            'payments' => $paginated,
            'total_incoming' => $total_incoming,
            'total_outgoing' => $total_outgoing,
            'filters' => $request->only(['search', 'payment_type', 'status', 'from_date', 'to_date']),
        ]);
    }

    public function create()
    {
        $clients = Client::select('id', 'name', 'company_name', 'email')
            ->with([
                'projects' => function ($q) {
                    $q->select('id', 'title', 'client_id', 'budget', 'actual_cost', 'status')
                        ->withSum([
                            'payments' => function ($p) {
                                $p->where('status', 'completed');
                            }
                        ], 'amount');
                }
            ])
            ->get();

        $invoices = Invoice::with('client')
            ->where('status', '!=', 'paid')
            ->where('balance', '>', 0)
            ->get();

        $paymentMethods = \App\Models\PaymentMethod::where('is_active', true)->get();

        return Inertia::render('Finance/Payments/Create', [
            'clients' => $clients,
            'invoices' => $invoices,
            'paymentMethods' => $paymentMethods,
        ]);
    }

    public function store(Request $request)
    {
        $paymentMethods = \App\Models\PaymentMethod::where('is_active', true)->pluck('code')->toArray();
        $methodValidation = count($paymentMethods) > 0
            ? 'required|in:' . implode(',', $paymentMethods)
            : 'required';

        $validated = $request->validate([
            'invoice_id' => 'nullable|exists:invoices,id',
            'client_id' => 'required|exists:clients,id',
            'project_id' => 'required|exists:projects,id',
            'payment_type' => 'required|in:incoming,outgoing',
            'payment_date' => 'required|date',
            'amount' => 'required|numeric|min:0.01',
            'payment_method' => $methodValidation,
            'reference_number' => 'nullable|string|max:255',
            'status' => 'required|in:pending,completed,failed,refunded',
            'notes' => 'nullable|string',
            'receipt' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:5120',
        ]);

        if ($request->hasFile('receipt')) {
            $file = $request->file('receipt');
            $filename = time() . '_' . $file->getClientOriginalName();
            $path = $file->storeAs('payments', $filename, 'public');
            $validated['receipt'] = $path;
        }

        $payment = Payment::create($validated);

        if ($request->boolean('redirect_back')) {
            return redirect()->back()->with('success', 'Payment recorded successfully!');
        }

        return redirect()->route('payments.index')->with('success', 'Payment recorded successfully!');
    }

    public function show(Payment $payment)
    {
        $payment->load(['invoice.client', 'client', 'project']);
        $design = \App\Models\SlipDesign::where('type', 'payment')->where('is_active', true)->first();

        // Calculate project due: budget minus total completed payments for this project
        $projectDue = null;
        if ($payment->project) {
            $totalPaid = Payment::where('project_id', $payment->project_id)
                ->where('payment_type', 'incoming')
                ->where('status', 'completed')
                ->sum('amount');
            $projectBudget = $payment->project->budget ?? 0;
            $projectDue = max(0, $projectBudget - $totalPaid);
        }

        return Inertia::render('Finance/Payments/Show', [
            'payment' => $payment,
            'slipDesign' => $design,
            'projectDue' => $projectDue,
        ]);
    }

    public function edit(Payment $payment)
    {
        $clients = Client::select('id', 'name', 'company_name', 'email')
            ->with([
                'projects' => function ($q) {
                    $q->select('id', 'title', 'client_id', 'budget', 'actual_cost', 'status')
                        ->withSum([
                            'payments' => function ($p) {
                                $p->where('status', 'completed');
                            }
                        ], 'amount');
                }
            ])
            ->get();
        $invoices = Invoice::with('client')
            ->where('status', '!=', 'paid')
            ->orWhere('id', $payment->invoice_id)
            ->get();

        $paymentMethods = \App\Models\PaymentMethod::where('is_active', true)->get();

        return Inertia::render('Finance/Payments/Edit', [
            'payment' => $payment,
            'clients' => $clients,
            'invoices' => $invoices,
            'paymentMethods' => $paymentMethods,
        ]);
    }

    public function update(Request $request, Payment $payment)
    {
        $paymentMethods = \App\Models\PaymentMethod::where('is_active', true)->pluck('code')->toArray();
        $methodValidation = count($paymentMethods) > 0
            ? 'required|in:' . implode(',', $paymentMethods)
            : 'required';

        $validated = $request->validate([
            'invoice_id' => 'nullable|exists:invoices,id',
            'client_id' => 'required|exists:clients,id',
            'project_id' => 'required|exists:projects,id',
            'payment_type' => 'required|in:incoming,outgoing',
            'payment_date' => 'required|date',
            'amount' => 'required|numeric|min:0.01',
            'payment_method' => $methodValidation,
            'reference_number' => 'nullable|string|max:255',
            'status' => 'required|in:pending,completed,failed,refunded',
            'notes' => 'nullable|string',
            'receipt' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:5120',
        ]);

        if ($request->hasFile('receipt')) {
            if ($payment->receipt) {
                Storage::disk('public')->delete($payment->receipt);
            }

            $file = $request->file('receipt');
            $filename = time() . '_' . $file->getClientOriginalName();
            $path = $file->storeAs('payments', $filename, 'public');
            $validated['receipt'] = $path;
        }

        $payment->update($validated);

        return redirect()->route('payments.index')->with('success', 'Payment updated successfully!');
    }

    public function destroy(Payment $payment)
    {
        if ($payment->receipt) {
            Storage::disk('public')->delete($payment->receipt);
        }

        $payment->delete();

        return redirect()->route('payments.index')->with('success', 'Payment deleted successfully!');
    }

    public function apiIndex(Request $request)
    {
        $query = Payment::with(['invoice', 'client']);

        if ($request->has('search')) {
            $search = $request->search;
            $query->where('payment_number', 'like', "%{$search}%");
        }

        $payments = $query->latest('payment_date')->paginate(15);

        return response()->json($payments);
    }

    public function apiShow(Payment $payment)
    {
        $payment->load(['invoice', 'client']);
        return response()->json($payment);
    }

    public function apiDestroy(Payment $payment)
    {
        if ($payment->receipt) {
            Storage::disk('public')->delete($payment->receipt);
        }

        $payment->delete();

        return response()->json(['message' => 'Payment deleted successfully']);
    }
    public function slip(Payment $payment)
    {
        $payment->load(['invoice.client', 'client', 'project']);

        $design = \App\Models\SlipDesign::where('type', 'payment')
            ->where('is_active', true)
            ->first();

        $appName = \App\Models\Setting::get('app_name', 'ZK Base Ltd.');
        $appLogo = \App\Models\Setting::get('app_logo');

        // Calculate project due: project budget minus total completed incoming payments
        $projectDue = null;
        if ($payment->project) {
            $totalPaid = Payment::where('project_id', $payment->project_id)
                ->where('payment_type', 'incoming')
                ->where('status', 'completed')
                ->sum('amount');
            $projectBudget = $payment->project->budget ?? 0;
            $projectDue = max(0, $projectBudget - $totalPaid);
        }

        return Inertia::render('Finance/Payments/Slip', [
            'payment'    => $payment,
            'projectDue' => $projectDue,
            'company'    => [
                'name'      => $design?->company_name    ?: $appName,
                'address'   => $design?->company_address ?: 'Corporate Office',
                'tagline'   => $design?->company_tagline ?: '',
                'logo'      => $design?->header_logo     ? '/storage/' . $design->header_logo
                             : ($appLogo                 ? '/storage/' . $appLogo : null),
                'watermark' => $design?->watermark_image ? '/storage/' . $design->watermark_image : null,
                'accent'    => $design?->accent_color    ?: '#10b981',
                'font'      => $design?->font_family     ?: 'Inter',
                'footer'    => $design?->footer_text     ?: '',
                'show_sig'  => $design?->show_signature_lines ?? true,
                'bank'      => $design?->show_bank_details ? $design->bank_details : null,
            ],
        ]);
    }
}
