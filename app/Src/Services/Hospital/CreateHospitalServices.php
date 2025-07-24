<?php

namespace App\Src\Services\Hospital;

use App\Models\Hospital;

class CreateHospitalServices
{
    public function __invoke(array $data)
    {
        return Hospital::create($data);
    }
}
