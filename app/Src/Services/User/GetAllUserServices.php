<?php

namespace App\Src\Services\User;

use App\Models\User;
use App\Src\Data\General\QueryBuilder;
use App\Src\Data\General\PaginateObject;

class GetAllUserServices
{
    public function __invoke(QueryBuilder $queryBuilder, PaginateObject $paginate, $trashed = false)
    {
        if($trashed){
            $modelUser = User::onlyTrashed();
        }else{
            $modelUser = User::query();
        }

        foreach ($queryBuilder->getWiths() as $with) {
            $modelUser->with($with);
        }

        if ($queryBuilder->active()) {
            foreach ($queryBuilder->getQuerys() as $filter) {
                $modelUser = $modelUser->where($filter['key'], $filter['operation'], $filter['value']);
            }
        }

        $functions = $queryBuilder->getFunctions();
        foreach ($functions as $func) {
            $func($modelUser);
        }

        if ($paginate->getActive()) {
            return $modelUser->paginate($paginate->getLimit(), ['*'], 'page', $paginate->getPage());
        }

        return $modelUser->get();
    }
}
