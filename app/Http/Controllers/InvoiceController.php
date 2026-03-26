<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\Client;
use App\Http\Requests\StoreInvoiceRequest;
use App\Http\Requests\UpdateInvoiceRequest;
use App\Services\InvoiceService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Response;

class InvoiceController extends Controller
{
    protected $invoiceService;

    public function __construct(InvoiceService $invoiceService)
    {
        $this->invoiceService = $invoiceService;
    }

    public function index(Request $request)
    {
        $query = Invoice::with(['client', 'items', 'payments']);

        // Search
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('invoice_number', 'like', "%{$search}%")
                    ->orWhere('notes', 'like', "%{$search}%")
                    ->orWhereHas('client', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%");
                    });
            });
        }

        // Filter by status
        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        // Filter by date range
        if ($request->has('from_date') && $request->from_date) {
            $query->whereDate('invoice_date', '>=', $request->from_date);
        }
        if ($request->has('to_date') && $request->to_date) {
            $query->whereDate('invoice_date', '<=', $request->to_date);
        }

        $invoices = $query->latest()->paginate(15);

        return Inertia::render('Finance/Invoices/Index', [
            'invoices' => $invoices,
            'filters' => $request->only(['search', 'status', 'from_date', 'to_date']),
        ]);
    }

    public function create()
    {
        $clients = Client::select('id', 'name', 'company_name', 'email')->get();

        return Inertia::render('Finance/Invoices/Create', [
            'clients' => $clients,
        ]);
    }

    public function store(StoreInvoiceRequest $request)
    {
        $this->invoiceService->createInvoice(
            $request->validated(),
            $request->file('attachment')
        );

        return redirect()->route('invoices.index')->with('success', 'Invoice created successfully!');
    }

    public function show(Invoice $invoice)
    {
        $invoice->load(['client', 'items', 'payments']);
        $design = \App\Models\SlipDesign::where('type', 'invoice')->where('is_active', true)->first();

        return Inertia::render('Finance/Invoices/Show', [
            'invoice' => $invoice,
            'slipDesign' => $design
        ]);
    }

    public function edit(Invoice $invoice)
    {
        $invoice->load('items');
        $clients = Client::select('id', 'name', 'company_name', 'email')->get();

        return Inertia::render('Finance/Invoices/Edit', [
            'invoice' => $invoice,
            'clients' => $clients,
        ]);
    }

    public function update(UpdateInvoiceRequest $request, Invoice $invoice)
    {
        $this->invoiceService->updateInvoice(
            $invoice,
            $request->validated(),
            $request->file('attachment')
        );

        return redirect()->route('invoices.index')->with('success', 'Invoice updated successfully!');
    }

    public function destroy(Invoice $invoice)
    {
        $this->invoiceService->deleteInvoice($invoice);

        return redirect()->route('invoices.index')->with('success', 'Invoice deleted successfully!');
    }

    // API Methods
    public function apiIndex(Request $request)
    {
        $query = Invoice::with(['client', 'items', 'payments']);

        if ($request->has('search')) {
            $search = $request->search;
            $query->where('invoice_number', 'like', "%{$search}%")
                ->orWhereHas('client', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%");
                });
        }

        $invoices = $query->latest()->paginate(15);

        return response()->json($invoices);
    }

    public function apiShow(Invoice $invoice)
    {
        $invoice->load(['client', 'items', 'payments']);
        return response()->json($invoice);
    }

    public function apiDestroy(Invoice $invoice)
    {
        $this->invoiceService->deleteInvoice($invoice);

        return response()->json(['message' => 'Invoice deleted successfully']);
    }

    public function exportToExcel(Request $request)
    {
        $query = Invoice::with(['client', 'items', 'payments']);

        // Apply same filters as index
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('invoice_number', 'like', "%{$search}%")
                    ->orWhere('notes', 'like', "%{$search}%")
                    ->orWhereHas('client', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%");
                    });
            });
        }

        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        if ($request->has('from_date') && $request->from_date) {
            $query->whereDate('invoice_date', '>=', $request->from_date);
        }
        if ($request->has('to_date') && $request->to_date) {
            $query->whereDate('invoice_date', '<=', $request->to_date);
        }

        $invoices = $query->latest()->get();

        // Create CSV content
        $csvData = [];
        $csvData[] = ['Invoice Number', 'Client', 'Date', 'Due Date', 'Subtotal', 'Tax', 'Discount', 'Total', 'Paid', 'Balance', 'Status'];

        foreach ($invoices as $invoice) {
            $csvData[] = [
                $invoice->invoice_number,
                $invoice->client->name ?? 'N/A',
                $invoice->invoice_date->format('Y-m-d'),
                $invoice->due_date->format('Y-m-d'),
                number_format($invoice->subtotal, 2),
                number_format($invoice->tax_amount, 2),
                number_format($invoice->discount_amount, 2),
                number_format($invoice->total_amount, 2),
                number_format($invoice->paid_amount, 2),
                number_format($invoice->balance, 2),
                ucfirst($invoice->status),
            ];
        }

        // Generate CSV
        $filename = 'invoices_' . date('Y-m-d_His') . '.csv';
        $handle = fopen('php://temp', 'r+');

        foreach ($csvData as $row) {
            fputcsv($handle, $row);
        }

        rewind($handle);
        $csv = stream_get_contents($handle);
        fclose($handle);

        return Response::make($csv, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ]);
    }

    public function exportInvoiceToExcel(Invoice $invoice)
    {
        $invoice->load(['client', 'items', 'payments']);

        // Create CSV content
        $csvData = [];

        // Header Information
        $csvData[] = ['INVOICE DETAILS'];
        $csvData[] = [];
        $csvData[] = ['Invoice Number', $invoice->invoice_number];
        $csvData[] = ['Invoice Date', \Carbon\Carbon::parse($invoice->invoice_date)->format('Y-m-d')];
        $csvData[] = ['Due Date', \Carbon\Carbon::parse($invoice->due_date)->format('Y-m-d')];
        $csvData[] = ['Status', ucfirst($invoice->status)];
        $csvData[] = [];

        // Client Information
        $csvData[] = ['CLIENT INFORMATION'];
        $csvData[] = ['Client Name', $invoice->client->name ?? 'N/A'];
        $csvData[] = ['Company', $invoice->client->company_name ?? 'N/A'];
        $csvData[] = ['Email', $invoice->client->email ?? 'N/A'];
        $csvData[] = ['Phone', $invoice->client->phone ?? 'N/A'];
        $csvData[] = [];

        // Line Items
        $csvData[] = ['LINE ITEMS'];
        $csvData[] = ['#', 'Description', 'Quantity', 'Unit Price', 'Total'];

        foreach ($invoice->items as $index => $item) {
            $csvData[] = [
                $index + 1,
                $item->description,
                $item->quantity,
                number_format($item->unit_price, 2),
                number_format($item->quantity * $item->unit_price, 2),
            ];
        }

        $csvData[] = [];

        // Financial Summary
        $csvData[] = ['FINANCIAL SUMMARY'];
        $csvData[] = ['Subtotal', number_format((float) $invoice->subtotal, 2)];
        $csvData[] = ['Tax', number_format((float) $invoice->tax_amount, 2)];
        $csvData[] = ['Discount', number_format((float) ($invoice->discount_amount ?? 0), 2)];
        $csvData[] = ['Total Amount', number_format((float) $invoice->total_amount, 2)];
        $csvData[] = ['Paid Amount', number_format((float) ($invoice->paid_amount ?? 0), 2)];
        $csvData[] = ['Balance Due', number_format((float) ($invoice->balance ?? 0), 2)];

        if ($invoice->notes) {
            $csvData[] = [];
            $csvData[] = ['NOTES'];
            $csvData[] = [$invoice->notes];
        }

        if ($invoice->terms) {
            $csvData[] = [];
            $csvData[] = ['TERMS & CONDITIONS'];
            $csvData[] = [$invoice->terms];
        }

        // Generate CSV
        $filename = 'invoice_' . $invoice->invoice_number . '_' . date('Y-m-d') . '.csv';
        $handle = fopen('php://temp', 'r+');

        foreach ($csvData as $row) {
            fputcsv($handle, $row);
        }

        rewind($handle);
        $csv = stream_get_contents($handle);
        fclose($handle);

        return Response::make($csv, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ]);
    }
}
