<?php

namespace App\Http\Controllers;

use App\Models\ExpenseCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ExpenseCategoryController extends Controller
{
    public function index(Request $request)
    {
        $query = ExpenseCategory::withCount('expenses');

        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($request->has('is_active') && $request->is_active !== null) {
            $query->where('is_active', $request->is_active);
        }

        $categories = $query->latest()->paginate(15);

        return Inertia::render('Finance/ExpenseCategories/Index', [
            'categories' => $categories,
            'filters' => $request->only(['search', 'is_active']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Finance/ExpenseCategories/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:expense_categories,code',
            'description' => 'nullable|string',
            'color' => 'nullable|string|max:7',
            'is_active' => 'boolean',
        ]);

        ExpenseCategory::create($validated);

        return redirect()->back()->with('success', 'Expense category created successfully!');
    }

    public function show(ExpenseCategory $expenseCategory)
    {
        $expenseCategory->loadCount('expenses');
        $expenseCategory->load([
            'expenses' => function ($query) {
                $query->latest()->limit(10);
            }
        ]);

        return Inertia::render('Finance/ExpenseCategories/Show', [
            'category' => $expenseCategory,
        ]);
    }

    public function edit(ExpenseCategory $expenseCategory)
    {
        return Inertia::render('Finance/ExpenseCategories/Edit', [
            'category' => $expenseCategory,
        ]);
    }

    public function update(Request $request, ExpenseCategory $expenseCategory)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:expense_categories,code,' . $expenseCategory->id,
            'description' => 'nullable|string',
            'color' => 'nullable|string|max:7',
            'is_active' => 'boolean',
        ]);

        $expenseCategory->update($validated);

        return redirect()->route('expense-categories.index')->with('success', 'Expense category updated successfully!');
    }

    public function destroy(ExpenseCategory $expenseCategory)
    {
        $expenseCategory->delete();

        return redirect()->route('expense-categories.index')->with('success', 'Expense category deleted successfully!');
    }

    public function apiIndex(Request $request)
    {
        $query = ExpenseCategory::query();

        if ($request->has('search')) {
            $search = $request->search;
            $query->where('name', 'like', "%{$search}%");
        }

        if ($request->has('active_only') && $request->active_only) {
            $query->where('is_active', true);
        }

        $categories = $query->latest()->get();

        return response()->json($categories);
    }

    public function apiShow(ExpenseCategory $expenseCategory)
    {
        return response()->json($expenseCategory);
    }

    public function apiDestroy(ExpenseCategory $expenseCategory)
    {
        $expenseCategory->delete();
        return response()->json(['message' => 'Expense category deleted successfully']);
    }
}
