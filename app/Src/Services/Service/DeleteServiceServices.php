<?php

namespace App\Src\Services\Service;

use App\Models\Service;

class DeleteServiceServices
{
    public function __invoke(int $id)
    {
        $service = Service::find($id);
        $service->delete();

        return $service;
    }
}
