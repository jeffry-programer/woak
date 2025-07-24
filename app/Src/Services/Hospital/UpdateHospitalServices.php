<?php

namespace App\Src\Services\Hospital;

use App\Models\Hospital;

class UpdateHospitalServices
{
    public function __invoke(array $data, int $id)
    {
        $hospital = Hospital::find($id);
        $hospital->update($data);

        return $hospital;
    }
}
