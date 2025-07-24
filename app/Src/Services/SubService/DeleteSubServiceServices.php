<?php

namespace App\Src\Services\SubService;

use App\Models\SubService;

class DeleteSubServiceServices
{
    public function __invoke(int $id)
    {
        $subService = SubService::find($id);
        $subService->delete();

        return $subService;
    }
}
