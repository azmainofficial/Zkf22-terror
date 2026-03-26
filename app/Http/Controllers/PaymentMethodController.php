<?php

namespace App\Http\Controllers;

use App\Models\PaymentMethod;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PaymentMethodController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:payment_methods',
        ]);

        PaymentMethod::create([
            'name' => $request->name,
            'code' => Str::slug($request->name),
            'is_active' => true,
        ]);

        return back()->with('success', 'Payment method added successfully.');
    }

    public function update(Request $request, PaymentMethod $paymentMethod)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:payment_methods,name,' . $paymentMethod->id,
            'is_active' => 'required|boolean',
        ]);

        $paymentMethod->update([
            'name' => $request->name,
            'code' => Str::slug($request->name),
            'is_active' => $request->is_active,
        ]);

        return back()->with('success', 'Payment method updated successfully.');
    }

    public function destroy(PaymentMethod $paymentMethod)
    {
        $paymentMethod->delete();
        return back()->with('success', 'Payment method deleted successfully.');
    }
}
