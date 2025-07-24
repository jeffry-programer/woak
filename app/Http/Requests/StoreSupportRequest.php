<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSupportRequest extends FormRequest
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
            'hospital_id' => 'required|exists:hospitals,id',
            'hospital_data' => 'string|required',
            'phone_number' => 'nullable',
            'subject' => 'string|required',
            'problem' => 'string|required',
            'status' => 'string|required',
        ];
    }

    public function messages()
    {
        return [
            'hospital_id.required' => 'El campo hospital es obligatorio',
            'hospital_id.exists' => 'El campo hospital debe existir',
            'hospital_data.required' => 'El campo hospital_data es obligatorio',
            'phone_number.required' => 'El campo phone_number es obligatorio',
            'subject.required' => 'El campo subject es obligatorio',
            'problem.required' => 'El campo problem es obligatorio',
            'status.required' => 'El campo status es obligatorio'
        ];
    }
}
