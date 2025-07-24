<?php

namespace App\Src\Services\Hospital;

use App\Models\Hospital;

class DeleteHospitalServices
{
    public function __invoke(int $id, bool $force = false)
    {
        if($force){
            $hospital = Hospital::onlyTrashed()->find($id);
            $hospital->forceDelete();
        }else{
            $hospital = Hospital::find($id);
            $hospital->delete();
        }
    }
}
