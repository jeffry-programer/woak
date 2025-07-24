<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreDirectoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; 
    }

    public function rules(): array
     {
    
        $rules = [
            'hospital_id' => ['required', 'integer', 'exists:hospitals,id'],
            'name' => ['required', 'string', 'max:255'],
            'unit_id' => ['required', 'integer', 'exists:units,id'],
            'phone_number' => ['required', 'string', 'max:20'],
            'description' => ['nullable', 'string', 'max:1000'],
        ];

        if ($this->isMethod('POST')) {
            $rules['hospital_id'] = ['required', 'integer', 'exists:hospitals,id'];

        } elseif ($this->isMethod('PUT') || $this->isMethod('PATCH')) {

            $rules['name'] = ['sometimes', 'string', 'max:255'];
            $rules['unit_id'] = ['sometimes', 'integer', 'exists:units,id'];
        }

        return $rules;
    }
}