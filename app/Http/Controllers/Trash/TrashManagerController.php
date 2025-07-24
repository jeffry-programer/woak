<?php

namespace App\Http\Controllers\Trash;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Src\Services\Trash\GetAllTrashServices;
use App\Src\Data\General\PaginateObject;
use App\Src\Data\General\QueryBuilder;


class TrashManagerController extends Controller
{
    public function index(Request $request)
    {
        return null;
    }
}