<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BrandController extends Controller
{
    public function index()
    {
        return Inertia::render('Brands/Index', [
            'brands' => Brand::with('supplier')->latest()->get(),
            'suppliers' => Supplier::all(['id', 'name', 'company_name']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'supplier_id' => 'nullable|exists:suppliers,id',
            'description' => 'nullable|string',
            'logo' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('logo')) {
            $path = $request->file('logo')->store('brands', 'public');
            $validated['logo'] = $path;
        }

        Brand::create($validated);

        return redirect()->back()->with('success', 'Brand created successfully.');
    }
    public function update(Request $request, Brand $brand)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'supplier_id' => 'nullable|exists:suppliers,id',
            'description' => 'nullable|string',
            'logo' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('logo')) {
            // Delete old logo
            if ($brand->logo) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($brand->logo);
            }
            $path = $request->file('logo')->store('brands', 'public');
            $validated['logo'] = $path;
        }

        $brand->update($validated);

        return redirect()->back()->with('success', 'Brand updated successfully.');
    }

    public function destroy(Brand $brand)
    {
        if ($brand->logo) {
            \Illuminate\Support\Facades\Storage::disk('public')->delete($brand->logo);
        }
        $brand->delete();

        return redirect()->back()->with('success', 'Brand deleted successfully.');
    }
}
