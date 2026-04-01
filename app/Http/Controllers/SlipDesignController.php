<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\SlipDesign;
use Illuminate\Support\Facades\Storage;

class SlipDesignController extends Controller
{
    const DOCUMENT_TYPES = ['invoice', 'payment', 'payroll', 'expense', 'project', 'report'];

    public function index(Request $request)
    {
        $designs = SlipDesign::query()
            ->when($request->search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->when($request->type, function ($query, $type) {
                $query->where('type', $type);
            })
            ->latest()
            ->paginate(12)
            ->withQueryString();

        // Active design per document type for the summary panel
        $activeDesigns = SlipDesign::where('is_active', true)
            ->get()
            ->keyBy('type');

        return \Inertia\Inertia::render('Settings/SlipDesigns/Index', [
            'designs'       => $designs,
            'filters'       => $request->only(['search', 'type']),
            'activeDesigns' => $activeDesigns,
            'documentTypes' => self::DOCUMENT_TYPES,
        ]);
    }

    public function create()
    {
        return \Inertia\Inertia::render('Settings/SlipDesigns/Create', [
            'documentTypes' => self::DOCUMENT_TYPES,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'                 => 'required|string|max:255',
            'type'                 => 'required|in:' . implode(',', self::DOCUMENT_TYPES),
            'accent_color'         => 'required|string|max:20',
            'font_family'          => 'required|string|max:50',
            'footer_text'          => 'nullable|string',
            'company_name'         => 'nullable|string|max:255',
            'company_address'      => 'nullable|string|max:500',
            'company_tagline'      => 'nullable|string|max:255',
            'show_signature_lines' => 'boolean',
            'show_bank_details'    => 'boolean',
            'bank_details'         => 'nullable|string',
            'header_logo'          => 'nullable|file|mimes:jpeg,png,jpg,svg|max:2048',
            'watermark_image'      => 'nullable|file|mimes:jpeg,png,jpg,svg|max:2048',
            'is_active'            => 'boolean',
        ]);

        if ($request->hasFile('header_logo')) {
            $validated['header_logo'] = $request->file('header_logo')->store('slip_designs/logos', 'public');
        }

        if ($request->hasFile('watermark_image')) {
            $validated['watermark_image'] = $request->file('watermark_image')->store('slip_designs/watermarks', 'public');
        }

        SlipDesign::create($validated);

        return redirect()->route('slip-designs.index')->with('success', 'Design created successfully.');
    }

    public function edit(SlipDesign $slipDesign)
    {
        return \Inertia\Inertia::render('Settings/SlipDesigns/Edit', [
            'design'        => $slipDesign,
            'documentTypes' => self::DOCUMENT_TYPES,
        ]);
    }

    public function update(Request $request, SlipDesign $slipDesign)
    {
        $validated = $request->validate([
            'name'                 => 'required|string|max:255',
            'type'                 => 'required|in:' . implode(',', self::DOCUMENT_TYPES),
            'accent_color'         => 'required|string|max:20',
            'font_family'          => 'required|string|max:50',
            'footer_text'          => 'nullable|string',
            'company_name'         => 'nullable|string|max:255',
            'company_address'      => 'nullable|string|max:500',
            'company_tagline'      => 'nullable|string|max:255',
            'show_signature_lines' => 'boolean',
            'show_bank_details'    => 'boolean',
            'bank_details'         => 'nullable|string',
            'header_logo'          => 'nullable|file|mimes:jpeg,png,jpg,svg|max:2048',
            'watermark_image'      => 'nullable|file|mimes:jpeg,png,jpg,svg|max:2048',
            'is_active'            => 'boolean',
        ]);

        if ($request->hasFile('header_logo')) {
            if ($slipDesign->header_logo) {
                Storage::disk('public')->delete($slipDesign->header_logo);
            }
            $validated['header_logo'] = $request->file('header_logo')->store('slip_designs/logos', 'public');
        }

        if ($request->hasFile('watermark_image')) {
            if ($slipDesign->watermark_image) {
                Storage::disk('public')->delete($slipDesign->watermark_image);
            }
            $validated['watermark_image'] = $request->file('watermark_image')->store('slip_designs/watermarks', 'public');
        }

        $slipDesign->update($validated);

        return redirect()->route('slip-designs.index')->with('success', 'Design updated successfully.');
    }

    public function destroy(SlipDesign $slipDesign)
    {
        if ($slipDesign->header_logo) {
            Storage::disk('public')->delete($slipDesign->header_logo);
        }
        if ($slipDesign->watermark_image) {
            Storage::disk('public')->delete($slipDesign->watermark_image);
        }

        $slipDesign->delete();

        return redirect()->back()->with('success', 'Design deleted.');
    }

    public function toggleStatus(SlipDesign $slipDesign)
    {
        $slipDesign->update(['is_active' => true]);
        return redirect()->back()->with('success', 'Design set as active.');
    }

    public function duplicate(SlipDesign $slipDesign)
    {
        $copy = $slipDesign->replicate();
        $copy->name       = $slipDesign->name . ' (Copy)';
        $copy->is_active  = false;
        $copy->save();

        return redirect()->route('slip-designs.edit', $copy->id)->with('success', 'Design duplicated. Edit the copy below.');
    }

    /**
     * API helper: return the active design for a given document type.
     * Called internally from other controllers when printing documents.
     */
    public static function getActiveDesign(string $type): ?SlipDesign
    {
        return SlipDesign::where('type', $type)->where('is_active', true)->first();
    }
}
