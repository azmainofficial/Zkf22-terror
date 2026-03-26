<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreClientRequest extends FormRequest
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
            'name' => 'required|string|max:255',
            'company_name' => 'required|string|max:255',
            'vat_number' => 'nullable|string|max:50',
            'industry' => 'nullable|string|max:100',
            'email' => 'required|email|unique:clients',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'city' => 'nullable|string|max:100',
            'website' => 'nullable|url',
            'linkedin' => 'nullable|url',
            'facebook' => 'nullable|url',
            'twitter' => 'nullable|url',
            'instagram' => 'nullable|url',
            'avatar' => 'nullable|image|max:2048',
            'logo' => 'nullable|image|max:2048',
            'status' => 'required|in:active,inactive,prospective',
            'notes' => 'nullable|string',
        ];
    }
}
