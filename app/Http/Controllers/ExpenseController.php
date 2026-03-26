<?php

namespace App\Http\Controllers;

use App\Models\PaymentMethod;
use App\Models\Expense;
use App\Models\ExpenseCategory;
use App\Models\Project;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;

class ExpenseController extends Controller
{
    public function index(Request $request)
    {
        $query = Expense::with(['category', 'project', 'approver']);

        // Search
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('expense_number', 'like', "%{$search}%")
                    ->orWhere('title', 'like', "%{$search}%")
                    ->orWhere('vendor_name', 'like', "%{$search}%")
                    ->orWhereHas('category', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%");
                    });
            });
        }

        // Filter by status
        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        // Filter by category
        if ($request->has('category_id') && $request->category_id) {
            $query->where('expense_category_id', $request->category_id);
        }

        // Filter by date range
        if ($request->has('from_date') && $request->from_date) {
            $query->whereDate('expense_date', '>=', $request->from_date);
        }
        if ($request->has('to_date') && $request->to_date) {
            $query->whereDate('expense_date', '<=', $request->to_date);
        }

        $expenses = $query->latest('expense_date')->paginate(15);
        $categories = ExpenseCategory::where('is_active', true)->get();
        $projects = Project::select('id', 'title')->get();
        $paymentMethods = PaymentMethod::where('is_active', true)->get();

        return Inertia::render('Finance/Expenses/Index', [
            'expenses' => $expenses,
            'categories' => $categories,
            'projects' => $projects,
            'paymentMethods' => $paymentMethods,
            'filters' => $request->only(['search', 'status', 'category_id', 'from_date', 'to_date']),
        ]);
    }

    public function create()
    {
        $categories = ExpenseCategory::where('is_active', true)->get();
        $projects = Project::select('id', 'title')->get();
        $paymentMethods = PaymentMethod::where('is_active', true)->get();

        return Inertia::render('Finance/Expenses/Create', [
            'categories' => $categories,
            'projects' => $projects,
            'paymentMethods' => $paymentMethods,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'expense_category_id' => 'required|exists:expense_categories,id',
            'project_id' => 'nullable|exists:projects,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'amount' => 'required|numeric|min:0.01',
            'expense_date' => 'required|date',
            'payment_method' => 'required|string|max:255',
            'vendor_name' => 'nullable|string|max:255',
            'receipt' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:5120',
            'status' => 'required|in:pending,approved,rejected,paid',
            'is_reimbursable' => 'boolean',
        ]);

        if ($request->hasFile('receipt')) {
            $file = $request->file('receipt');
            $filename = time() . '_' . $file->getClientOriginalName();
            $path = $file->storeAs('expenses', $filename, 'public');
            $validated['receipt'] = $path;
        }

        $expense = Expense::create($validated);

        return redirect()->route('expenses.index')->with('success', 'Expense created successfully!');
    }

    public function show(Expense $expense)
    {
        $expense->load(['category', 'project', 'approver']);

        return Inertia::render('Finance/Expenses/Show', [
            'expense' => $expense,
        ]);
    }

    public function edit(Expense $expense)
    {
        $categories = ExpenseCategory::where('is_active', true)->get();
        $projects = Project::select('id', 'title')->get();
        $paymentMethods = PaymentMethod::where('is_active', true)->get();

        return Inertia::render('Finance/Expenses/Edit', [
            'expense' => $expense,
            'categories' => $categories,
            'projects' => $projects,
            'paymentMethods' => $paymentMethods,
        ]);
    }

    public function update(Request $request, Expense $expense)
    {
        $validated = $request->validate([
            'expense_category_id' => 'required|exists:expense_categories,id',
            'project_id' => 'nullable|exists:projects,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'amount' => 'required|numeric|min:0.01',
            'expense_date' => 'required|date',
            'payment_method' => 'required|string|max:255',
            'vendor_name' => 'nullable|string|max:255',
            'receipt' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:5120',
            'status' => 'required|in:pending,approved,rejected,paid',
            'is_reimbursable' => 'boolean',
        ]);

        if ($request->hasFile('receipt')) {
            if ($expense->receipt) {
                Storage::disk('public')->delete($expense->receipt);
            }

            $file = $request->file('receipt');
            $filename = time() . '_' . $file->getClientOriginalName();
            $path = $file->storeAs('expenses', $filename, 'public');
            $validated['receipt'] = $path;
        }

        $expense->update($validated);

        return redirect()->route('expenses.index')->with('success', 'Expense updated successfully!');
    }

    public function destroy(Expense $expense)
    {
        if ($expense->receipt) {
            Storage::disk('public')->delete($expense->receipt);
        }

        $expense->delete();

        return redirect()->route('expenses.index')->with('success', 'Expense deleted successfully!');
    }

    public function approve(Request $request, Expense $expense)
    {
        $validated = $request->validate([
            'approval_notes' => 'nullable|string',
        ]);

        $expense->approve(Auth::id(), $validated['approval_notes'] ?? null);

        return back()->with('success', 'Expense approved successfully!');
    }

    public function reject(Request $request, Expense $expense)
    {
        $validated = $request->validate([
            'approval_notes' => 'required|string',
        ]);

        $expense->reject(Auth::id(), $validated['approval_notes']);

        return back()->with('success', 'Expense rejected!');
    }

    public function apiIndex(Request $request)
    {
        $query = Expense::with(['category', 'project', 'approver']);

        if ($request->has('search')) {
            $search = $request->search;
            $query->where('title', 'like', "%{$search}%");
        }

        $expenses = $query->latest('expense_date')->paginate(15);

        return response()->json($expenses);
    }

    public function apiShow(Expense $expense)
    {
        $expense->load(['category', 'project', 'approver']);
        return response()->json($expense);
    }

    public function apiDestroy(Expense $expense)
    {
        if ($expense->receipt) {
            Storage::disk('public')->delete($expense->receipt);
        }

        $expense->delete();

        return response()->json(['message' => 'Expense deleted successfully']);
    }

    public function exportToExcel(Request $request)
    {
        $query = Expense::with(['category', 'project']);

        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('expense_number', 'like', "%{$search}%")
                    ->orWhere('title', 'like', "%{$search}%")
                    ->orWhere('vendor_name', 'like', "%{$search}%");
            });
        }

        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        if ($request->has('from_date') && $request->from_date) {
            $query->whereDate('expense_date', '>=', $request->from_date);
        }
        if ($request->has('to_date') && $request->to_date) {
            $query->whereDate('expense_date', '<=', $request->to_date);
        }

        $expenses = $query->latest('expense_date')->get();

        $csvData = [];
        $csvData[] = ['Expense #', 'Date', 'Title', 'Category', 'Project', 'Vendor', 'Amount', 'Status', 'Payment Method'];

        foreach ($expenses as $expense) {
            $csvData[] = [
                $expense->expense_number,
                $expense->expense_date,
                $expense->title,
                $expense->category->name ?? 'N/A',
                $expense->project->title ?? 'N/A',
                $expense->vendor_name ?? 'N/A',
                number_format($expense->amount, 2),
                ucfirst($expense->status),
                ucfirst(str_replace('_', ' ', $expense->payment_method)),
            ];
        }

        $filename = 'expenses_' . date('Y-m-d_His') . '.csv';
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
