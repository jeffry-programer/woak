<?php

namespace App\Src\Services\HospitalUser;

use App\Models\HospitalUser;

class DeleteHospitalUserServices
{
    public function __invoke(int $id)
    {
        $hospitalUser = HospitalUser::find($id);
        $hospitalUser->delete();

        return $hospitalUser;
    }
}
