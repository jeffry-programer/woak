<?php

namespace App\Src\Services\Professions;

use App\Models\Profession;

class UpdateProfessionServices
{
    public function __invoke(array $data, int $id)
    {
        $profession = Profession::find($id);
        $profession->update($data);

        return $profession;
    }
}
