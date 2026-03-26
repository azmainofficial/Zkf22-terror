<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProjectRequest extends FormRequest
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
            'title' => 'required|string|max:255',
            'client_id' => 'required|exists:clients,id',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date',
            'budget' => 'required|numeric|min:0',
            'status' => 'required|string',
            'priority' => 'required|string',
            'description' => 'nullable|string',
            'contract_details' => 'nullable|json',
            'designs' => 'nullable|array',
            'designs.*' => 'file|max:10240', // Max 10MB
        ];
    }

    protected function prepareForValidation()
    {
        $this->merge([
            'end_date' => $this->deadline,
            'budget' => $this->contract_amount,
        ]);
    }
}
