<?php

namespace App\Src\Services\HospitalUser;

use App\Models\HospitalUser;

class CreateHospitalUserServices
{
    public function __invoke(array $data)
    {
        return HospitalUser::create($data);
    }
}
