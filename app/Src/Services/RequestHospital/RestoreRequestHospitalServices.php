<?php

namespace App\Src\Services\RequestHospital;

use App\Models\RequestHospital;

class RestoreRequestHospitalServices
{
    public function __invoke(int $id)
    {
        $requestHospital = RequestHospital::onlyTrashed()->find($id);
        $requestHospital->restore();

        return $requestHospital;
    }
}
