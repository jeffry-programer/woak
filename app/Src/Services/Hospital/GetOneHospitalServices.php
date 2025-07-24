<?php

namespace App\Src\Services\Hospital;

use App\Models\Hospital;

class GetOneHospitalServices
{
    public function __invoke(int $id)
    {
        return Hospital::find($id);
    }
}
