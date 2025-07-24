<?php

namespace App\Src\Services\User;

use App\Models\User;

class GetOneUserServices
{
    public function __invoke(int $id)
    {
        return User::find($id);
    }
}
