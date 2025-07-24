<?php

namespace App\Src\Services\RequestHospital;

use App\Models\RequestHospital;

class DeleteRequestHospitalServices
{
    public function __invoke(int $id, bool $force = false)
    {
        if($force){
            $requestHospital = RequestHospital::onlyTrashed()->find($id);
            $requestHospital->forceDelete();
        }else{
            $requestHospital = RequestHospital::find($id);
            $requestHospital->delete();
        }
    }
}
