<?php

namespace App\Src\Services\Professions;

use App\Models\Profession;

class CreateProfessionServices
{
    public function __invoke(array $data)
    {
        return Profession::create($data);
    }
}
