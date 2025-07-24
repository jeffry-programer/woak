<?php

namespace App\Src\Services\User;

use App\Models\User;

class UpdateUserServices
{
    public function __invoke(array $data, int $id)
    {
        $user = User::find($id);
        $user->name  = $data['name'];
        $user->email = $data['email'];
        if(array_key_exists('password', $data)){
            $user->password = bcrypt($data['password']);
        }
        $user->status = $data['status'] === 'true' ? true : false;
        $user->save();

        return $user;
    }
}
