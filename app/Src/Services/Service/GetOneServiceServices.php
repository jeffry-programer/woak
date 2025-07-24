<?php

namespace App\Src\Services\Service;

use App\Models\Service;

class GetOneServiceServices
{
    public function __invoke(int $id)
    {
        return Service::where('id', $id)->with('units')->first();
    }
}
