<?php

namespace App\Src\Services\Support;

use App\Models\Support;

class CreateSupportServices
{
    public function __invoke(array $data)
    {
        return Support::create($data);
    }
}
