<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\PerformanceReview;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PerformanceController extends Controller
{
    public function index()
    {
        return Inertia::render('Employee/Performance/Index', [
            'reviews' => PerformanceReview::with(['employee', 'reviewer'])->latest()->get(),
        ]);
    }

    public function store(Request $request, Employee $employee)
    {
        $validated = $request->validate([
            'review_date' => 'required|date',
            'rating' => 'required|integer|min:1|max:5',
            'kpi_score' => 'required|numeric|min:0|max:100',
            'comments' => 'nullable|string',
            'goals' => 'nullable|string',
        ]);

        $validated['reviewer_id'] = Auth::id();

        $employee->performanceReviews()->create($validated);

        return back()->with('success', 'Performance review added.');
    }

    public function destroy(PerformanceReview $review)
    {
        $review->delete();
        return back()->with('success', 'Performance review removed.');
    }
}
