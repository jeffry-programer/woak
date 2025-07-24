<?php

namespace App\Src\Services\SubService;

use App\Models\SubService;

class GetOneSubServiceServices
{
    public function __invoke(int $id)
    {
        return SubService::find($id);
    }
}
