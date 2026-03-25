<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ZktecoADMSController;
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

use App\Http\Controllers\DashboardController;

Route::get('/dashboard', [DashboardController::class, 'index'])->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::get('/attendance', [ZktecoADMSController::class, 'index'])->name('attendance.index');
    Route::resource('/employees', \App\Http\Controllers\EmployeeController::class);
    Route::resource('/shifts', \App\Http\Controllers\ShiftController::class);
    Route::get('attendance/report', [\App\Http\Controllers\AttendanceReportController::class, 'monthly'])->name('attendance.report');
    Route::get('attendance/sheet', [\App\Http\Controllers\AttendanceReportController::class, 'sheet'])->name('attendance.sheet');
});

// ZKTeco ADMS Routes
Route::prefix('iclock')->group(function () {
    Route::match(['get', 'post'], '/cdata', [ZktecoADMSController::class, 'handleCData']);
    Route::get('/getrequest', [ZktecoADMSController::class, 'handleGetRequest']);
});

require __DIR__.'/auth.php';
