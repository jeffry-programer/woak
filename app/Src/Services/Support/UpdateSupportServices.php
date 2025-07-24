<?php

namespace App\Src\Services\Support;

use App\Models\Support;

class UpdateSupportServices
{
    public function __invoke(array $data, int $id): Support
    {
        $support = Support::findOrFail($id);
        $support->update($data);
        return $support;
    }
}