<?php

namespace App\Src\Services\Directory;

use App\Models\Directory;

class DeleteDirectoryServices
{
    public function __invoke(int $id)
    {
        $directory = Directory::find($id);
        $directory->delete();

        return $directory;
    }
}
