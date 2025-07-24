<?php

namespace App\Src\Services\Hospital;

use App\Models\Hospital;

class RestoreHospitalServices
{
    public function __invoke(int $id)
    {
        $hospital = Hospital::withTrashed()->find($id);
        $hospital->restore();

        return $hospital;
    }
}
