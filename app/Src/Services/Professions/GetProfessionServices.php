<?php

namespace App\Src\Services\Professions;

use App\Models\Profession;

class GetProfessionServices
{
    public function __invoke(int $id)
    {
        return Profession::find($id);
    }
}
