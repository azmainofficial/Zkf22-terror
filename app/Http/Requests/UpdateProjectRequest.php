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
            'title'            => 'required|string|max:255',
            'client_id'        => 'required|exists:clients,id',
            'start_date'       => 'nullable|date',
            'deadline'         => 'nullable|date',
            'end_date'         => 'nullable|date',
            'budget'           => 'nullable|numeric|min:0',
            'contract_amount'  => 'nullable|numeric|min:0',
            'actual_cost'      => 'nullable|numeric|min:0',
            'status'           => 'required|string',
            'priority'         => 'nullable|string',
            'progress'         => 'nullable|integer|min:0|max:100',
            'description'      => 'nullable|string',
            'contract_details' => 'nullable|array',
            'image'            => 'nullable|image|max:2048',
            'designs'          => 'nullable|array',
            'designs.*'        => 'nullable|file|max:30720',
            'documents'        => 'nullable|array',
            'documents.*'      => 'nullable|file|max:30720',
        ];
    }

    protected function prepareForValidation()
    {
        $this->merge([
            'end_date' => $this->end_date ?? $this->deadline,
            'budget' => $this->budget ?? $this->contract_amount ?? 0,
        ]);
    }
}
