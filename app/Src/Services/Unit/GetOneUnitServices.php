<?php

namespace App\Src\Services\Unit;

use App\Models\Unit;

class GetOneUnitServices
{
    public function __invoke(int $id)
    {
        return Unit::find($id);
    }
}
