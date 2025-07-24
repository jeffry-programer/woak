<?php

namespace App\Src\Services\Professions;

use App\Models\Profession;

class DeleteProfessionServices
{
    public function __invoke(int $id)
    {
        $profession = Profession::find($id);
        $profession->delete();

        return $profession;
    }
}
