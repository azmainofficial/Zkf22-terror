<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProjectRequest extends FormRequest
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
            'actual_cost' => 'required|numeric|min:0',
            'status' => 'required|string',
            'priority' => 'required|string',
            'progress' => 'required|integer|min:0|max:100',
            'description' => 'nullable|string',
            'contract_details' => 'nullable',
            'image' => 'nullable|image|max:2048',
        ];
    }
}
