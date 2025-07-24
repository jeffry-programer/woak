<?php

namespace App\Src\Services\HospitalUser;

use App\Models\HospitalUser;

class GetHospitalUserServices
{
    public function __invoke(int $id)
    {
        return HospitalUser::find($id);
    }
}
