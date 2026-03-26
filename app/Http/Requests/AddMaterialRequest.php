<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AddMaterialRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'inventory_item_id' => 'required|exists:inventory_items,id',
            'quantity_needed' => 'required|numeric|min:0',
            'unit_cost' => 'required|numeric|min:0',
        ];
    }
}
