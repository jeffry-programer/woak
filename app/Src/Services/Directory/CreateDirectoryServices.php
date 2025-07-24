<?php

namespace App\Src\Services\Directory;

use App\Models\Directory;

class CreateDirectoryServices
{
    public function __invoke(array $data): Directory
    {
        return Directory::create($data);
    }
}