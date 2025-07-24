<?php

namespace App\Src\Services\HospitalUser;

use App\Models\HospitalUser;

class UpdateHospitalUserServices
{
    public function __invoke(array $data, int $id)
    {
        $hospitalUser = HospitalUser::find($id);
        $hospitalUser->update($data);

        return $hospitalUser;
    }
}
