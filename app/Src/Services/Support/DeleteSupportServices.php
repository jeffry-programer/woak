<?php

namespace App\Src\Services\Support;

use App\Models\Support;

class DeleteSupportServices
{
    public function __invoke(int $id)
    {
        $support = Support::find($id);
        $support->delete();

        return $support;
    }
}
