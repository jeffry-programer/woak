<?php

namespace App\Src\Services\Unit;

use App\Models\Unit;

class UpdateUnitServices
{
    public function __invoke(array $data, int $id)
    {
        $unit = Unit::find($id);
        $unit->fill($data);
        if(isset($data['unit_image'])){
            $data['unit_image']->storeAs("public/units/",$data['unit_image']->getClientOriginalName());
            $unit->unit_image = "/storage/public/units/" . $data['unit_image']->getClientOriginalName();
        }
        $unit->save();
        return $unit;
    }
}
