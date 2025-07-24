<?php

namespace App\Src\Services\RequestHospital;

use App\Models\RequestHospital;

class UpdateRequestHospitalServices
{
    public function __invoke(array $data, int $id)
    {
        $requestHospital = RequestHospital::find($id);
        $requestHospital->update($data);

        return $requestHospital;
    }
}
