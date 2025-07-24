<?php

namespace App\Src\Services\User;

use App\Models\User;

class CreateUserServices
{
    public function __invoke(array $data)
    {
        return User::create($data);
    }
}
