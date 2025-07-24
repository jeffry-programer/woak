<?php

namespace App\Src\Services\User;

use App\Models\User;

class RestoreUserServices
{
    public function __invoke(int $id)
    {
        $user = User::withTrashed()->find($id);
        $user->restore();

        return $user;
    }
}
