<?php

namespace App\Src\Services\Support;

use App\Models\Support;

class GetOneSupportServices
{
    public function __invoke(int $id)
    {
        return Support::find($id);
    }
}
