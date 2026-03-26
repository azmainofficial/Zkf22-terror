<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use App\Models\Invoice;
use App\Models\Payment;
use App\Models\Payroll;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Carbon;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $startDate = $request->input('start_date')
            ? Carbon::parse($request->input('start_date'))->startOfDay()
            : Carbon::now()->startOfMonth();

        $endDate = $request->input('end_date')
            ? Carbon::parse($request->input('end_date'))->endOfDay()
            : Carbon::now()->endOfDay();

        // New Collections (Incoming Payments)
        $newCollections = Payment::where('payment_type', 'incoming')
            ->where('status', 'completed')
            ->whereBetween('payment_date', [$startDate, $endDate])
            ->sum('amount');

        // Salary Expenses (Paid Payrolls)
        $salaryExpenses = Payroll::where('status', 'paid')
            ->where(function ($query) use ($startDate, $endDate) {
                $query->whereBetween('payment_date', [$startDate, $endDate])
                    ->orWhere(function ($q) use ($startDate, $endDate) {
                        $q->whereNull('payment_date')->whereBetween('updated_at', [$startDate, $endDate]);
                    });
            })
            ->sum('total');

        // Other Expenses (Approved/Paid Expenses)
        $otherExpenses = Expense::whereIn('status', ['approved', 'paid'])
            ->whereBetween('expense_date', [$startDate, $endDate])
            ->sum('amount');

        $totalExpenses = $otherExpenses + $salaryExpenses;

        $dueCollection = Invoice::where('status', '!=', 'paid')->sum('balance');

        $netProfit = $newCollections - $totalExpenses;

        $dailyData = $this->getDailyBreakdown($startDate, $endDate);

        $monthlyData = $this->getMonthlyBreakdownDynamic($startDate, $endDate);

        $totalReceivable = Invoice::where('status', '!=', 'paid')->sum('balance');

        return Inertia::render('Reports/Index', [
            'summary' => [
                'new_collections' => $newCollections,
                'due_collection' => $dueCollection,
                'total_receivable' => $totalReceivable,
                'salary_expenses' => $salaryExpenses,
                'other_expenses' => $otherExpenses,
                'total_expenses' => $totalExpenses,
                'net_profit' => $netProfit,
            ],
            'daily_data' => $dailyData,
            'monthly_data' => $monthlyData,
            'filters' => [
                'start_date' => $startDate->format('Y-m-d'),
                'end_date' => $endDate->format('Y-m-d'),
            ]
        ]);
    }

    public function exportDaily(Request $request)
    {
        $startDate = $request->input('start_date') ? Carbon::parse($request->input('start_date'))->startOfDay() : Carbon::now()->startOfMonth();
        $endDate = $request->input('end_date') ? Carbon::parse($request->input('end_date'))->endOfDay() : Carbon::now()->endOfDay();

        $data = $this->getDailyBreakdown($startDate, $endDate);

        $headers = [
            'Content-Type' => 'application/vnd.ms-excel',
            'Content-Disposition' => 'attachment; filename="daily_report_' . $startDate->format('Ymd') . '-' . $endDate->format('Ymd') . '.xls"',
        ];

        $callback = function () use ($data) {
            $file = fopen('php://output', 'w');

            fwrite($file, '<!DOCTYPE html><html xmlns:x="urn:schemas-microsoft-com:office:excel"><head><meta charset="UTF-8">');
            fwrite($file, '<!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Daily Report</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->');
            fwrite($file, '<style>td, th { border: 1px solid #cccccc; padding: 5px; text-align: center; } th { background-color: #f3f4f6; font-weight: bold; }</style></head><body>');
            fwrite($file, '<table><thead><tr>');

            $headings = ['Date', 'Total Collection', 'Project Collection', 'New Dues (Invoiced)', 'Salary Paid', 'Operational Expense', 'Net Profit'];
            foreach ($headings as $heading) {
                fwrite($file, '<th>' . $heading . '</th>');
            }
            fwrite($file, '</tr></thead><tbody>');

            foreach ($data as $row) {
                fwrite($file, '<tr>');
                fwrite($file, '<td>' . $row['date'] . '</td>');
                fwrite($file, '<td>' . number_format($row['total_collection'], 2, '.', '') . '</td>');
                fwrite($file, '<td>' . number_format($row['project_collection'], 2, '.', '') . '</td>');
                fwrite($file, '<td>' . number_format($row['new_invoice_amount'], 2, '.', '') . '</td>');
                fwrite($file, '<td>' . number_format($row['salary_paid'], 2, '.', '') . '</td>');
                fwrite($file, '<td>' . number_format($row['operational_expense'], 2, '.', '') . '</td>');
                fwrite($file, '<td>' . number_format($row['net_profit'], 2, '.', '') . '</td>');
                fwrite($file, '</tr>');
            }

            fwrite($file, '</tbody></table></body></html>');
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    public function exportMonthly(Request $request)
    {
        $startDate = $request->input('start_date') ? Carbon::parse($request->input('start_date'))->startOfMonth() : Carbon::now()->subMonths(6)->startOfMonth();
        $endDate = $request->input('end_date') ? Carbon::parse($request->input('end_date'))->endOfMonth() : Carbon::now()->endOfMonth();

        $data = $this->getMonthlyBreakdownDynamic($startDate, $endDate);

        $headers = [
            'Content-Type' => 'application/vnd.ms-excel',
            'Content-Disposition' => 'attachment; filename="monthly_report_' . $startDate->format('Ym') . '-' . $endDate->format('Ym') . '.xls"',
        ];

        $callback = function () use ($data) {
            $file = fopen('php://output', 'w');

            fwrite($file, '<!DOCTYPE html><html xmlns:x="urn:schemas-microsoft-com:office:excel"><head><meta charset="UTF-8">');
            fwrite($file, '<!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Monthly Report</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->');
            fwrite($file, '<style>td, th { border: 1px solid #cccccc; padding: 5px; text-align: center; } th { background-color: #f3f4f6; font-weight: bold; }</style></head><body>');
            fwrite($file, '<table><thead><tr>');

            $headings = ['Month', 'Total Collection', 'Project Collection', 'New Dues (Invoiced)', 'Salary Paid', 'Operational Expense', 'Net Profit'];
            foreach ($headings as $heading) {
                fwrite($file, '<th>' . $heading . '</th>');
            }
            fwrite($file, '</tr></thead><tbody>');

            foreach ($data as $row) {
                fwrite($file, '<tr>');
                fwrite($file, '<td>' . $row['month'] . '</td>');
                fwrite($file, '<td>' . number_format($row['total_collection'], 2, '.', '') . '</td>');
                fwrite($file, '<td>' . number_format($row['project_collection'], 2, '.', '') . '</td>');
                fwrite($file, '<td>' . number_format($row['new_invoice_amount'], 2, '.', '') . '</td>');
                fwrite($file, '<td>' . number_format($row['salary_paid'], 2, '.', '') . '</td>');
                fwrite($file, '<td>' . number_format($row['operational_expense'], 2, '.', '') . '</td>');
                fwrite($file, '<td>' . number_format($row['net_profit'], 2, '.', '') . '</td>');
                fwrite($file, '</tr>');
            }

            fwrite($file, '</tbody></table></body></html>');
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    private function getMonthlyBreakdownDynamic($startDate, $endDate)
    {
        $months = [];
        $period = \Carbon\CarbonPeriod::create($startDate, '1 month', $endDate);

        foreach ($period as $date) {
            $start = $date->copy()->startOfMonth();
            $end = $date->copy()->endOfMonth();
            $monthName = $start->format('M Y');

            $totalCollection = Payment::where('payment_type', 'incoming')
                ->where('status', 'completed')
                ->whereBetween('payment_date', [$start, $end])
                ->sum('amount');

            $projectCollection = Payment::where('payment_type', 'incoming')
                ->where('status', 'completed')
                ->whereNotNull('project_id')
                ->whereBetween('payment_date', [$start, $end])
                ->sum('amount');

            $newInvoiceAmount = Invoice::whereBetween('created_at', [$start, $end])->sum('total_amount');

            $salaryPaid = Payroll::where('status', 'paid')
                ->whereBetween('payment_date', [$start, $end])
                ->sum('total');

            $operationalExpense = Expense::whereIn('status', ['approved', 'paid'])
                ->whereBetween('expense_date', [$start, $end])
                ->sum('amount');

            $totalExpense = $salaryPaid + $operationalExpense;
            $netProfit = $totalCollection - $totalExpense;

            $months[] = [
                'month' => $monthName,
                'total_collection' => $totalCollection,
                'project_collection' => $projectCollection,
                'new_invoice_amount' => $newInvoiceAmount,
                'salary_paid' => $salaryPaid,
                'operational_expense' => $operationalExpense,
                'net_profit' => $netProfit,
                'income' => $totalCollection,
                'expense' => $totalExpense,
                'profit' => $netProfit,
            ];
        }
        return $months;
    }

    private function getDailyBreakdown($startDate, $endDate)
    {
        $collections = Payment::where('payment_type', 'incoming')
            ->where('status', 'completed')
            ->whereBetween('payment_date', [$startDate, $endDate])
            ->selectRaw("DATE(payment_date) as day, SUM(amount) as total")
            ->groupBy('day')
            ->pluck('total', 'day')
            ->toArray();

        $projectCollections = Payment::where('payment_type', 'incoming')
            ->where('status', 'completed')
            ->whereNotNull('project_id')
            ->whereBetween('payment_date', [$startDate, $endDate])
            ->selectRaw("DATE(payment_date) as day, SUM(amount) as total")
            ->groupBy('day')
            ->pluck('total', 'day')
            ->toArray();

        $newInvoices = Invoice::whereBetween('created_at', [$startDate, $endDate])
            ->selectRaw("DATE(created_at) as day, SUM(total_amount) as total")
            ->groupBy('day')
            ->pluck('total', 'day')
            ->toArray();

        $salaryPaid = Payroll::where('status', 'paid')
            ->whereBetween('payment_date', [$startDate, $endDate])
            ->selectRaw("DATE(payment_date) as day, SUM(total) as total")
            ->groupBy('day')
            ->pluck('total', 'day')
            ->toArray();

        $opExpenses = Expense::whereIn('status', ['approved', 'paid'])
            ->whereBetween('expense_date', [$startDate, $endDate])
            ->selectRaw("DATE(expense_date) as day, SUM(amount) as total")
            ->groupBy('day')
            ->pluck('total', 'day')
            ->toArray();

        $days = [];
        $period = \Carbon\CarbonPeriod::create($startDate, $endDate);

        foreach ($period as $date) {
            $day = $date->format('Y-m-d');
            $totalCollection = $collections[$day] ?? 0;
            $projectCollection = $projectCollections[$day] ?? 0;
            $newInvoiceAmount = $newInvoices[$day] ?? 0;
            $salary = $salaryPaid[$day] ?? 0;
            $opExpense = $opExpenses[$day] ?? 0;
            $totalExpense = $salary + $opExpense;
            $netProfit = $totalCollection - $totalExpense;

            $days[] = [
                'date' => $day,
                'total_collection' => $totalCollection,
                'project_collection' => $projectCollection,
                'new_invoice_amount' => $newInvoiceAmount,
                'salary_paid' => $salary,
                'operational_expense' => $opExpense,
                'net_profit' => $netProfit,
                'income' => $totalCollection,
                'expense' => $totalExpense,
            ];
        }

        return $days;
    }
}
