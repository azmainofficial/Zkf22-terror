<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class SlipDesignController extends Controller
{
    public function index(Request $request)
    {
        $designs = \App\Models\SlipDesign::query()
            ->when($request->search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->when($request->type, function ($query, $type) {
                $query->where('type', $type);
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return \Inertia\Inertia::render('Settings/SlipDesigns/Index', [
            'designs' => $designs,
            'filters' => $request->only(['search', 'type']),
        ]);
    }

    public function create()
    {
        return \Inertia\Inertia::render('Settings/SlipDesigns/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:invoice,payment',
            'accent_color' => 'required|string|max:20',
            'font_family' => 'required|string|max:50',
            'footer_text' => 'nullable|string',
            'header_logo' => 'nullable|file|mimes:jpeg,png,jpg,svg|max:2048',
            'watermark_image' => 'nullable|file|mimes:jpeg,png,jpg,svg|max:2048',
            'is_active' => 'boolean'
        ]);

        if ($request->hasFile('header_logo')) {
            $validated['header_logo'] = $request->file('header_logo')->store('slip_designs/logos', 'public');
        }

        if ($request->hasFile('watermark_image')) {
            $validated['watermark_image'] = $request->file('watermark_image')->store('slip_designs/watermarks', 'public');
        }

        \App\Models\SlipDesign::create($validated);

        return redirect()->route('slip-designs.index')->with('success', 'Design created successfully.');
    }

    public function edit(\App\Models\SlipDesign $slipDesign)
    {
        return \Inertia\Inertia::render('Settings/SlipDesigns/Edit', [
            'design' => $slipDesign
        ]);
    }

    public function update(Request $request, \App\Models\SlipDesign $slipDesign)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:invoice,payment',
            'accent_color' => 'required|string|max:20',
            'font_family' => 'required|string|max:50',
            'footer_text' => 'nullable|string',
            'header_logo' => 'nullable|file|mimes:jpeg,png,jpg,svg|max:2048',
            'watermark_image' => 'nullable|file|mimes:jpeg,png,jpg,svg|max:2048',
            'is_active' => 'boolean'
        ]);

        if ($request->hasFile('header_logo')) {
            if ($slipDesign->header_logo) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($slipDesign->header_logo);
            }
            $validated['header_logo'] = $request->file('header_logo')->store('slip_designs/logos', 'public');
        }

        if ($request->hasFile('watermark_image')) {
            if ($slipDesign->watermark_image) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($slipDesign->watermark_image);
            }
            $validated['watermark_image'] = $request->file('watermark_image')->store('slip_designs/watermarks', 'public');
        }

        $slipDesign->update($validated);

        return redirect()->route('slip-designs.index')->with('success', 'Design updated successfully.');
    }

    public function destroy(\App\Models\SlipDesign $slipDesign)
    {
        if ($slipDesign->header_logo) {
            \Illuminate\Support\Facades\Storage::disk('public')->delete($slipDesign->header_logo);
        }
        if ($slipDesign->watermark_image) {
            \Illuminate\Support\Facades\Storage::disk('public')->delete($slipDesign->watermark_image);
        }

        $slipDesign->delete();

        return redirect()->back()->with('success', 'Design deleted successfully.');
    }

    public function toggleStatus(\App\Models\SlipDesign $slipDesign)
    {
        $slipDesign->update(['is_active' => true]);
        return redirect()->back()->with('success', 'Design activated successfully.');
    }
}
