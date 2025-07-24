<?php

namespace App\Src\Services\Directory;

use App\Models\Directory;

class UpdateDirectoryServices
{
    public function __invoke(array $data, int $id): Directory
    {
        $directoryEntry = Directory::findOrFail($id);

        $directoryEntry->update($data);

        return $directoryEntry->fresh(['unit', 'createdBy', 'editedBy']);
    }
}