<?php

namespace App\Http\Controllers;

use App\Models\InventoryItem;
use App\Models\Brand;
use App\Models\Supplier;
use App\Models\Client;
use App\Models\Project;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InventoryItemController extends Controller
{
    public function index(Request $request)
    {
        $query = InventoryItem::with(['brand', 'supplier', 'client', 'project']);

        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                    ->orWhere('sku', 'like', '%' . $request->search . '%');
            });
        }

        if ($request->status && $request->status !== 'All') {
            $query->where('status', strtolower($request->status));
        }

        if ($request->project_id) {
            $query->where('project_id', $request->project_id);
        }

        if ($request->client_id) {
            $query->where('client_id', $request->client_id);
        }

        if ($request->brand_id) {
            $query->where('brand_id', $request->brand_id);
        }

        // Date filtering
        if ($request->month) {
            $query->whereMonth('created_at', date('m', strtotime($request->month)))
                ->whereYear('created_at', date('Y', strtotime($request->month)));
        }

        if ($request->from_date) {
            $query->whereDate('created_at', '>=', $request->from_date);
        }

        if ($request->to_date) {
            $query->whereDate('created_at', '<=', $request->to_date);
        }

        $items = $query->latest()->paginate(12)->withQueryString();

        $totalValueQuery = InventoryItem::query();

        if ($request->search) {
            $totalValueQuery->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                    ->orWhere('sku', 'like', '%' . $request->search . '%');
            });
        }
        if ($request->status && $request->status !== 'All') {
            $totalValueQuery->where('status', strtolower($request->status));
        }
        if ($request->project_id) {
            $totalValueQuery->where('project_id', $request->project_id);
        }
        if ($request->client_id) {
            $totalValueQuery->where('client_id', $request->client_id);
        }
        if ($request->brand_id) {
            $totalValueQuery->where('brand_id', $request->brand_id);
        }
        if ($request->month) {
            $totalValueQuery->whereMonth('created_at', date('m', strtotime($request->month)))
                ->whereYear('created_at', date('Y', strtotime($request->month)));
        }
        if ($request->from_date) {
            $totalValueQuery->whereDate('created_at', '>=', $request->from_date);
        }
        if ($request->to_date) {
            $totalValueQuery->whereDate('created_at', '<=', $request->to_date);
        }

        $totalValue = $totalValueQuery->selectRaw('SUM(quantity_in_stock * unit_price) as total')->value('total') ?? 0;

        return Inertia::render('Inventory/Index', [
            'items' => $items,
            'filters' => $request->only(['search', 'status', 'project_id', 'client_id', 'brand_id', 'month', 'from_date', 'to_date']),
            'projects' => Project::all(['id', 'title', 'client_id']),
            'clients' => Client::all(['id', 'name', 'company_name']),
            'brands' => Brand::all(['id', 'name']),
            'totalValue' => $totalValue,
        ]);
    }

    public function create(Request $request)
    {
        return Inertia::render('Inventory/Create', [
            'brands' => Brand::all(['id', 'name']),
            'suppliers' => Supplier::all(['id', 'company_name']),
            'clients' => Client::all(['id', 'company_name', 'name']),
            'projects' => Project::with('client:id,company_name,name')->get(['id', 'title', 'client_id']),
            'units' => \App\Models\Unit::where('is_active', true)->get(['id', 'name', 'abbreviation']),
            'selected_project_id' => $request->project_id,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'sku' => 'nullable|string',
            'brand_id' => 'required|exists:brands,id',
            'unit' => 'required|string|max:50',
            'quantity_in_stock' => 'required|numeric|min:0',
            'reorder_level' => 'nullable|numeric|min:0',
            'unit_price' => 'required|numeric|min:0',
            'status' => 'nullable|in:active,inactive,discontinued',
            'supplier_id' => 'nullable|exists:suppliers,id',
            'client_id' => 'nullable|exists:clients,id',
            'project_id' => 'nullable|exists:projects,id',
        ]);

        if (empty($validated['status'])) {
            $validated['status'] = 'active';
        }

        if (!empty($validated['project_id'])) {
            $project = Project::find($validated['project_id']);
            if ($project) {
                $validated['client_id'] = $project->client_id;
            }
        }

        InventoryItem::create($validated);

        return redirect()->route('inventory.index')->with('success', 'Product added to inventory successfully.');
    }

    public function show(InventoryItem $inventory)
    {
        return Inertia::render('Inventory/Show', [
            'item' => $inventory->load(['brand.supplier', 'client', 'project.client']),
        ]);
    }

    public function edit(InventoryItem $inventory)
    {
        return Inertia::render('Inventory/Edit', [
            'item' => $inventory,
            'brands' => Brand::all(['id', 'name']),
            'suppliers' => Supplier::all(['id', 'company_name']),
            'clients' => Client::all(['id', 'company_name', 'name']),
            'projects' => Project::with('client:id,company_name,name')->get(['id', 'title', 'client_id']),
            'units' => \App\Models\Unit::where('is_active', true)->get(['id', 'name', 'abbreviation']),
        ]);
    }

    public function update(Request $request, InventoryItem $inventory)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'sku' => 'nullable|string',
            'brand_id' => 'required|exists:brands,id',
            'unit' => 'required|string|max:50',
            'quantity_in_stock' => 'required|numeric|min:0',
            'reorder_level' => 'nullable|numeric|min:0',
            'unit_price' => 'required|numeric|min:0',
            'status' => 'nullable|in:active,inactive,discontinued',
            'supplier_id' => 'nullable|exists:suppliers,id',
            'client_id' => 'nullable|exists:clients,id',
            'project_id' => 'nullable|exists:projects,id',
        ]);

        if (empty($validated['status'])) {
            $validated['status'] = $inventory->status;
        }

        if (!empty($validated['project_id'])) {
            $project = Project::find($validated['project_id']);
            if ($project) {
                $validated['client_id'] = $project->client_id;
            }
        }

        $inventory->update($validated);

        return redirect()->route('inventory.index')->with('success', 'Product updated successfully.');
    }

    public function destroy(InventoryItem $inventory)
    {
        $inventory->delete();
        return redirect()->route('inventory.index')->with('success', 'Product removed from inventory.');
    }

    public function exportToExcel(Request $request)
    {
        $query = InventoryItem::with(['brand.supplier', 'client', 'project']);

        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                    ->orWhere('sku', 'like', '%' . $request->search . '%');
            });
        }

        if ($request->status && $request->status !== 'All') {
            $query->where('status', strtolower($request->status));
        }

        if ($request->project_id) {
            $query->where('project_id', $request->project_id);
        }

        if ($request->client_id) {
            $query->where('client_id', $request->client_id);
        }

        // Date filtering
        if ($request->month) {
            $query->whereMonth('created_at', date('m', strtotime($request->month)))
                ->whereYear('created_at', date('Y', strtotime($request->month)));
        }

        if ($request->from_date) {
            $query->whereDate('created_at', '>=', $request->from_date);
        }

        if ($request->to_date) {
            $query->whereDate('created_at', '<=', $request->to_date);
        }

        $items = $query->latest()->get();
        $totalValue = $items->sum(function ($item) {
            return $item->quantity_in_stock * $item->unit_price;
        });

        // Create CSV content
        $csvData = [];
        $csvData[] = ['SKU', 'Name', 'Brand', 'Supplier', 'Stock', 'Unit', 'Unit Price', 'Total Value', 'Status', 'Project', 'Client', 'Date Added'];

        foreach ($items as $item) {
            $csvData[] = [
                $item->sku,
                $item->name,
                $item->brand->name ?? 'N/A',
                $item->brand->supplier->company_name ?? 'N/A',
                $item->quantity_in_stock,
                $item->unit,
                number_format($item->unit_price, 2),
                number_format($item->quantity_in_stock * $item->unit_price, 2),
                ucfirst($item->status),
                $item->project->title ?? 'N/A',
                $item->client->company_name ?? 'N/A',
                $item->created_at->format('Y-m-d'),
            ];
        }

        // Generate CSV
        $filename = 'procurement_report_' . date('Y-m-d_His') . '.csv';
        $handle = fopen('php://temp', 'r+');

        foreach ($csvData as $row) {
            fputcsv($handle, $row);
        }

        rewind($handle);
        $csv = stream_get_contents($handle);
        fclose($handle);

        return \Illuminate\Support\Facades\Response::make($csv, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ]);
    }
}
