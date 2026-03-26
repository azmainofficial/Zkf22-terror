<?php

namespace App\Http\Controllers;

use App\Models\Unit;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UnitController extends Controller
{
    public function index()
    {
        return Inertia::render('Units/Index', [
            'units' => Unit::where('is_active', true)->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'abbreviation' => 'required|string|max:50',
        ]);

        $validated['is_active'] = true;

        Unit::create($validated);

        return redirect()->back()->with('success', 'Unit added successfully');
    }

    public function update(Request $request, Unit $unit)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'abbreviation' => 'required|string|max:50',
            'is_active' => 'boolean',
        ]);

        $unit->update($validated);

        return redirect()->back()->with('success', 'Unit updated successfully');
    }

    public function destroy(Unit $unit)
    {
        $unit->update(['is_active' => false]);

        return redirect()->back()->with('success', 'Unit deleted successfully');
    }
}
