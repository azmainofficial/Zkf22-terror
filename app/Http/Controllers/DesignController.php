<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

use App\Models\Design;
use Illuminate\Support\Facades\Storage;

class DesignController extends Controller
{
    public function index()
    {
        $designs = Design::with(['client', 'project'])
            ->latest()
            ->paginate(12);

        return Inertia::render('Designs/Index', [
            'designs' => $designs
        ]);
    }

    public function destroy(Design $design)
    {
        if ($design->file_path) {
            Storage::disk('public')->delete($design->file_path);
        }
        $design->delete();
        return back()->with('success', 'Design deleted successfully.');
    }
}
