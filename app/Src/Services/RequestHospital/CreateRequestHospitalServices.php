<?php

namespace App\Src\Services\RequestHospital;

use App\Models\RequestHospital;

class CreateRequestHospitalServices
{
    public function __invoke(array $data)
    {
        return RequestHospital::create($data);
    }
}
