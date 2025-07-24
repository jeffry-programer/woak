<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreServiceRequest extends FormRequest
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
            'service_name' => 'required|string|max:100',
            'status' => 'nullable|boolean',
            'order' => 'nullable|integer',
            'service_image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ];

    }

    public function messages()
    {
        return [
            'hospital_id.required' => 'El campo hospital es obligatorio',
            'hospital_id.exists' => 'El campo hospital debe existir',
            'service_name.required' => 'El campo nombre es obligatorio',
            'service_image.image' => 'El campo imagen debe ser una imagen',
            'service_image.mimes' => 'El campo imagen debe ser una imagen con extension jpeg, png, jpg',
            'service_image.max' => 'El campo imagen debe tener un maximo de 2048 kb',
        ];
    }
}
