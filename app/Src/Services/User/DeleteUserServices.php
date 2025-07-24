<?php

namespace App\Src\Services\User;

use App\Models\User;

class DeleteUserServices
{
    public function __invoke(int $id, bool $force = false)
    {
        if($force){
            $user = User::onlyTrashed()->find($id);
            $user->forceDelete();
        }else{
            $user = User::find($id);
            $user->delete();
        }
    }
}
