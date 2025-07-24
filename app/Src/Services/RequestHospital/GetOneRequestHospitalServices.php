<?php

namespace App\Src\Services\RequestHospital;

use App\Models\RequestHospital;

class GetOneRequestHospitalServices
{
    public function __invoke(int $id)
    {
        return RequestHospital::find($id);
    }
}
