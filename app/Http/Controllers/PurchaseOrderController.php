<?php

namespace App\Http\Controllers;

use App\Models\PurchaseOrder;
use App\Models\Supplier;
use App\Models\InventoryItem;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class PurchaseOrderController extends Controller
{
    public function index(Request $request)
    {
        $query = PurchaseOrder::query()->with(['supplier']);

        if ($request->search) {
            $query->where('po_number', 'like', '%' . $request->search . '%')
                ->orWhereHas('supplier', function ($q) use ($request) {
                    $q->where('company_name', 'like', '%' . $request->search . '%');
                });
        }

        if ($request->status && $request->status !== 'All') {
            $query->where('status', strtolower($request->status));
        }

        return Inertia::render('Finance/PurchaseOrders/Index', [
            'orders' => $query->latest()->paginate(15)->appends(request()->query()),
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Finance/PurchaseOrders/Create', [
            'suppliers' => Supplier::select('id', 'name', 'company_name')->get(),
            'inventory_items' => InventoryItem::select('id', 'name', 'unit', 'unit_price', 'sku')->get(),
            'new_po_number' => 'PO-' . strtoupper(Str::random(8)),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'supplier_id' => 'required|exists:suppliers,id',
            'order_date' => 'required|date',
            'expected_delivery_date' => 'nullable|date',
            'status' => 'required|string',
            'notes' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.inventory_item_id' => 'required|exists:inventory_items,id',
            'items.*.quantity' => 'required|numeric|min:1',
            'items.*.unit_price' => 'required|numeric|min:0',
        ]);

        $po = PurchaseOrder::create([
            'po_number' => 'PO-' . strtoupper(Str::random(10)), // or use submitted
            'supplier_id' => $validated['supplier_id'],
            'order_date' => $validated['order_date'],
            'expected_delivery_date' => $validated['expected_delivery_date'],
            'status' => $validated['status'],
            'notes' => $validated['notes'] ?? null,
            'total_amount' => 0, // Calculated below
        ]);

        $total = 0;
        foreach ($validated['items'] as $item) {
            $lineTotal = $item['quantity'] * $item['unit_price'];
            $po->items()->create([
                'inventory_item_id' => $item['inventory_item_id'],
                'quantity' => $item['quantity'],
                'unit_price' => $item['unit_price'],
                'total_price' => $lineTotal,
            ]);
            $total += $lineTotal;
        }

        $po->update(['total_amount' => $total]);

        if ($po->status === 'received') {
            foreach ($po->items as $item) {
                $inventory = InventoryItem::find($item->inventory_item_id);
                if ($inventory) {
                    $inventory->increment('quantity_in_stock', $item['quantity']);
                }
            }
        }

        return redirect()->route('suppliers.show', $po->supplier_id)->with('success', 'Purchase Order created.');
    }

    public function show(PurchaseOrder $purchaseOrder)
    {
        $purchaseOrder->load(['supplier', 'items.inventoryItem']);
        return Inertia::render('Finance/PurchaseOrders/Show', [
            'order' => $purchaseOrder
        ]);
    }

    public function update(Request $request, PurchaseOrder $purchaseOrder)
    {
        $validated = $request->validate([
            'status' => 'required|string',
        ]);

        $oldStatus = $purchaseOrder->status;
        $purchaseOrder->update(['status' => $validated['status']]);

        if ($oldStatus !== 'received' && $validated['status'] === 'received') {
            foreach ($purchaseOrder->items as $item) {
                $inventory = InventoryItem::find($item->inventory_item_id);
                if ($inventory) {
                    $inventory->increment('quantity_in_stock', $item->quantity);
                }
            }
        }

        return back()->with('success', 'Order status updated.');
    }

    public function destroy(PurchaseOrder $purchaseOrder)
    {
        $purchaseOrder->delete();
        return back()->with('success', 'Order deleted.');
    }
}
