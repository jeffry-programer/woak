<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSubServiceStore extends FormRequest
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
            'service_id' => 'required|exists:services,id',
            'sub_service_name' => 'required|string|max:100',
            'status' => 'nullable|boolean',
            'sub_service_image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ];

    }

    public function messages(): array
    {
        return [
            'service_id.required' => 'El campo servicio es obligatorio',
            'service_id.exists' => 'El campo servicio debe existir',
            'sub_service_name.required' => 'El campo nombre es obligatorio',
            'sub_service_image.image' => 'El campo imagen debe ser una imagen',
            'sub_service_image.mimes' => 'El campo imagen debe ser una imagen con extension jpeg, png, jpg',
            'sub_service_image.max' => 'El campo imagen debe tener un maximo de 2048 kb',
        ];
    }
}
