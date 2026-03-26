<?php

namespace App\Http\Controllers;

use App\Models\Supplier;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class SupplierController extends Controller
{
    public function index(Request $request)
    {
        $query = Supplier::query();

        if ($request->search) {
            $query->where('name', 'like', '%' . $request->search . '%')
                ->orWhere('company_name', 'like', '%' . $request->search . '%')
                ->orWhere('email', 'like', '%' . $request->search . '%');
        }

        if ($request->status && $request->status !== 'All') {
            $query->where('status', strtolower($request->status));
        }

        return Inertia::render('Suppliers/Index', [
            'suppliers' => $query->latest()->paginate(10)->appends(request()->query()),
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Suppliers/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'company_name' => 'required|string|max:255',
            'email' => 'nullable|email|unique:suppliers',
            'phone' => 'required|string',
            'address' => 'nullable|string',
            'avatar' => 'nullable|image|max:2048',
            'status' => 'required|string',
            'payment_terms' => 'nullable|string',
            'credit_limit' => 'nullable|numeric',
        ]);

        if ($request->hasFile('avatar')) {
            $validated['avatar'] = $request->file('avatar')->store('suppliers/avatars', 'public');
        }

        $validated['credit_limit'] = $validated['credit_limit'] ?? 0;
        $validated['payment_terms'] = $validated['payment_terms'] ?? '';

        Supplier::create($validated);

        if ($request->boolean('redirect_back')) {
            return redirect()->back()->with('success', 'Supplier created successfully.');
        }

        return redirect()->route('suppliers.index')->with('success', 'Supplier created successfully.');
    }

    public function show(Supplier $supplier)
    {
        $supplier->load(['brands.inventoryItems']);

        $connectedClients = \App\Models\Client::whereHas('inventoryItems', function ($q) use ($supplier) {
            $q->where('supplier_id', $supplier->id);
        })->with([
                    'projects' => function ($q) {
                        $q->where('status', 'active');
                    }
                ])->get();

        return Inertia::render('Suppliers/Show', [
            'supplier' => $supplier,
            'connectedClients' => $connectedClients
        ]);
    }

    public function edit(Supplier $supplier)
    {
        return Inertia::render('Suppliers/Edit', [
            'supplier' => $supplier
        ]);
    }

    public function update(Request $request, Supplier $supplier)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'company_name' => 'required|string|max:255',
            'email' => 'nullable|email|unique:suppliers,email,' . $supplier->id,
            'phone' => 'required|string',
            'address' => 'nullable|string',
            'avatar' => 'nullable|image|max:2048',
            'status' => 'required|string',
            'payment_terms' => 'nullable|string',
            'credit_limit' => 'nullable|numeric',
        ]);

        if ($request->hasFile('avatar')) {
            if ($supplier->avatar) {
                Storage::disk('public')->delete($supplier->avatar);
            }
            $validated['avatar'] = $request->file('avatar')->store('suppliers/avatars', 'public');
        }

        $validated['credit_limit'] = $validated['credit_limit'] ?? $supplier->credit_limit ?? 0;
        $validated['payment_terms'] = $validated['payment_terms'] ?? $supplier->payment_terms ?? '';

        $supplier->update($validated);

        return redirect()->route('suppliers.index')->with('success', 'Supplier updated successfully.');
    }

    public function destroy(Supplier $supplier)
    {
        if ($supplier->avatar) {
            Storage::disk('public')->delete($supplier->avatar);
        }
        $supplier->delete();
        return redirect()->route('suppliers.index')->with('success', 'Supplier deleted successfully.');
    }
}
