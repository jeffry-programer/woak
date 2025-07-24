<?php

namespace App\Src\Services\Directory;

use App\Models\Directory;

class GetOneDirectoryServices
{
    public function __invoke(int $id): ?Directory
    {
        return Directory::with(['unit', 'createdBy', 'editedBy'])->find($id);
    }
}