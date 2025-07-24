<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreUnitRequest extends FormRequest
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
            'unit_name' => 'required|string|max:100',
            'status' => 'nullable|integer',
            'unit_image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ];
    }

    public function messages()
    {
        return [
            'hospital_id.required' => 'El campo hospital es obligatorio',
            'hospital_id.exists' => 'El campo hospital debe existir',
            'unit_name.required' => 'El campo nombre es obligatorio',
            'unit_image.image' => 'El campo imagen debe ser una imagen',
            'unit_image.mimes' => 'El campo imagen debe ser una imagen con extension jpeg, png, jpg',
            'unit_image.max' => 'El campo imagen debe tener un maximo de 2048 kb',
        ];
    }
}
