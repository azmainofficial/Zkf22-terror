<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ZktecoADMSController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\AttendanceReportController;
use App\Http\Controllers\DeviceController;
use App\Http\Controllers\ShiftController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\BrandController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\FinanceController;
use App\Http\Controllers\DesignController;
use App\Http\Controllers\AutomationController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\LeaveController;
use App\Http\Controllers\EmployeeTaskController;
use App\Http\Controllers\PerformanceController;
use App\Http\Controllers\EmployeeDocumentController;
use App\Http\Controllers\PurchaseOrderController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\ExpenseCategoryController;
use App\Http\Controllers\PaymentMethodController;
use App\Http\Controllers\InventoryItemController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\AuditLogController;
use App\Http\Controllers\DesignVersionController;
use App\Http\Controllers\UserManagementController;
use App\Http\Controllers\BiometricController;
use App\Http\Controllers\PayrollController;
use App\Http\Controllers\UnitController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\SlipDesignController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', [DashboardController::class, 'index'])->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth', 'log_activity'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Project Management
    Route::resource('projects', ProjectController::class);
    Route::post('projects/{project}/materials', [ProjectController::class, 'addMaterial'])->name('projects.materials.add');
    Route::patch('projects/materials/{projectMaterial}', [ProjectController::class, 'updateMaterial'])->name('projects.materials.update');
    Route::delete('projects/materials/{projectMaterial}', [ProjectController::class, 'removeMaterial'])->name('projects.materials.destroy');
    Route::post('projects/{project}/designs', [ProjectController::class, 'uploadDesign'])->name('projects.designs.upload');

    Route::resource('employees', EmployeeController::class);
    Route::resource('shifts', ShiftController::class);
    Route::get('attendance', [ZktecoADMSController::class, 'index'])->name('attendance.index');
    Route::get('attendance/report', [AttendanceReportController::class, 'monthly'])->name('attendance.report');
    Route::get('attendance/sheet', [AttendanceReportController::class, 'sheet'])->name('attendance.sheet');
    Route::get('attendance/export', [AttendanceController::class, 'export'])->name('attendance.export');
    Route::post('employees/{employee}/attendance', [AttendanceController::class, 'store'])->name('employees.attendance.store');
    Route::post('employees/{employee}/leave', [LeaveController::class, 'store'])->name('employees.leave.store');
    Route::get('leaves', [LeaveController::class, 'index'])->name('leaves.index');
    Route::post('leave/{leave}/status', [LeaveController::class, 'updateStatus'])->name('leave.status.update');
    Route::post('employees/{employee}/performance', [PerformanceController::class, 'store'])->name('employees.performance.store');
    Route::get('performance', [PerformanceController::class, 'index'])->name('performance.index');
    Route::post('employees/{employee}/documents', [EmployeeDocumentController::class, 'store'])->name('employees.documents.store');
    Route::post('employees/{employee}/tasks', [EmployeeTaskController::class, 'store'])->name('employees.tasks.store');
    Route::patch('tasks/{task}/status', [EmployeeTaskController::class, 'updateStatus'])->name('tasks.status.update');
    Route::delete('tasks/{task}', [EmployeeTaskController::class, 'destroy'])->name('tasks.destroy');
    Route::delete('attendance/{attendance}', [AttendanceController::class, 'destroy'])->name('attendance.destroy');
    Route::delete('leave/{leave}', [LeaveController::class, 'destroy'])->name('leave.destroy');
    Route::delete('performance/{review}', [PerformanceController::class, 'destroy'])->name('performance.destroy');
    Route::delete('documents/{document}', [EmployeeDocumentController::class, 'destroy'])->name('documents.destroy');

    // Payroll
    Route::get('payroll/sheet', [PayrollController::class, 'salarySheet'])->name('payroll.sheet');
    Route::post('payroll/generate', [PayrollController::class, 'generate'])->name('payroll.generate');
    Route::resource('payroll', PayrollController::class);

    // Clients & Brands
    Route::resource('clients', ClientController::class);
    Route::post('clients/{client}/brands', [ClientController::class, 'addBrand'])->name('clients.brands.add');
    Route::delete('clients/{client}/brands/{brand}', [ClientController::class, 'removeBrand'])->name('clients.brands.remove');
    Route::post('clients/{client}/designs', [ClientController::class, 'uploadDesign'])->name('clients.designs.upload');
    Route::resource('brands', BrandController::class);
    Route::resource('suppliers', SupplierController::class);
    Route::resource('purchase-orders', PurchaseOrderController::class);

    // Finance
    Route::get('invoices/export/excel', [InvoiceController::class, 'exportToExcel'])->name('invoices.export.excel');
    Route::get('invoices/{invoice}/export', [InvoiceController::class, 'exportInvoiceToExcel'])->name('invoices.export');
    Route::resource('invoices', InvoiceController::class);
    Route::get('payments/export/excel', [PaymentController::class, 'exportToExcel'])->name('payments.export.excel');
    Route::get('payments/{payment}/export', [PaymentController::class, 'exportPaymentToExcel'])->name('payments.export');
    Route::resource('payments', PaymentController::class);
    Route::get('expenses/export/excel', [ExpenseController::class, 'exportToExcel'])->name('expenses.export.excel');
    Route::resource('expenses', ExpenseController::class);
    Route::post('expenses/{expense}/approve', [ExpenseController::class, 'approve'])->name('expenses.approve');
    Route::post('expenses/{expense}/reject', [ExpenseController::class, 'reject'])->name('expenses.reject');
    Route::resource('expense-categories', ExpenseCategoryController::class);
    Route::get('payment-methods', [SettingController::class, 'index'])->name('payment-methods.index');
    Route::post('payment-methods', [PaymentMethodController::class, 'store'])->name('payment-methods.store');
    Route::patch('payment-methods/{paymentMethod}', [PaymentMethodController::class, 'update'])->name('payment-methods.update');
    Route::delete('payment-methods/{paymentMethod}', [PaymentMethodController::class, 'destroy'])->name('payment-methods.destroy');

    // Inventory & Units
    Route::resource('inventory', InventoryItemController::class);
    Route::get('inventory/export/excel', [InventoryItemController::class, 'exportToExcel'])->name('inventory.export.excel');
    Route::post('units', [UnitController::class, 'store'])->name('units.store');
    Route::get('units', [UnitController::class, 'index'])->name('units.index');
    Route::patch('units/{unit}', [UnitController::class, 'update'])->name('units.update');
    Route::delete('units/{unit}', [UnitController::class, 'destroy'])->name('units.destroy');

    // General Modules
    Route::get('/finance', [FinanceController::class, 'index'])->name('finance.index');
    Route::get('/designs', [DesignController::class, 'index'])->name('designs.index');
    Route::delete('designs/{design}', [DesignController::class, 'destroy'])->name('designs.destroy');
    Route::get('/automation', [AutomationController::class, 'index'])->name('automation.index');
    Route::get('/settings', [SettingController::class, 'index'])->name('settings.index');
    Route::post('/settings', [SettingController::class, 'update'])->name('settings.update');
    Route::resource('slip-designs', SlipDesignController::class);
    Route::post('slip-designs/{slipDesign}/toggle', [SlipDesignController::class, 'toggleStatus'])->name('slip-designs.toggle');
    Route::get('/reports', [ReportController::class, 'index'])->name('reports.index');

    // Devices (existing)
    Route::resource('devices', DeviceController::class)->only(['index', 'update']);

    // RBAC
    Route::middleware(['permission:manage_roles'])->group(function () {
        Route::resource('roles', RoleController::class);
        Route::post('roles/assign-user', [RoleController::class, 'assignToUser'])->name('roles.assign-user');
        Route::post('roles/remove-user', [RoleController::class, 'removeFromUser'])->name('roles.remove-user');
    });

    Route::middleware(['permission:manage_users'])->group(function () {
        Route::get('users', [UserManagementController::class, 'index'])->name('users.index');
        Route::get('users/{user}', [UserManagementController::class, 'show'])->name('users.show');
        Route::post('users', [UserManagementController::class, 'store'])->name('users.store');
        Route::put('users/{user}', [UserManagementController::class, 'update'])->name('users.update');
        Route::delete('users/{user}', [UserManagementController::class, 'destroy'])->name('users.destroy');
        Route::post('users/{user}/assign-role', [UserManagementController::class, 'assignRole'])->name('users.assign-role');
        Route::post('users/{user}/remove-role', [UserManagementController::class, 'removeRole'])->name('users.remove-role');
    });

    Route::middleware(['permission:view_audit_logs'])->group(function () {
        Route::get('audit-logs', [AuditLogController::class, 'index'])->name('audit-logs.index');
        Route::get('audit-logs/{auditLog}', [AuditLogController::class, 'show'])->name('audit-logs.show');
        Route::get('audit-logs/export/csv', [AuditLogController::class, 'export'])->name('audit-logs.export');
    });
});

// ZKTeco ADMS Routes
Route::prefix('iclock')->group(function () {
    Route::match(['get', 'post'], '/cdata', [ZktecoADMSController::class, 'handleCData']);
    Route::get('/getrequest', [ZktecoADMSController::class, 'handleGetRequest']);
});

require __DIR__ . '/auth.php';
