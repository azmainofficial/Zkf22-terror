<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class AutomationController extends Controller
{
    public function index()
    {
        return Inertia::render('Automation/Index');
    }
}
