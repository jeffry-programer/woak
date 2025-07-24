<?php

namespace App\Src\Services\Unit;

use App\Models\Unit;

class DeleteUnitService
{
    public function __invoke(int $id)
    {
        $unit = Unit::find($id);
        $unit->delete();

        return $unit;
    }
}
