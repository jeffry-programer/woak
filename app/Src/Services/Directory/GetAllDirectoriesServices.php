<?php

namespace App\Src\Services\Directory;

use App\Models\Directory;
use App\Src\Data\General\PaginateObject;
use App\Src\Data\General\QueryBuilder;

class GetAllDirectoriesServices
{
    public function __invoke(QueryBuilder $queryBuilder, PaginateObject $paginate)
    {
        $modelDirectory = Directory::query();

        foreach ($queryBuilder->getWiths() as $with) {
            $modelDirectory->with($with);
        }

        if ($queryBuilder->active()) {
            foreach ($queryBuilder->getQuerys() as $filter) {
                $modelDirectory = $modelDirectory->where($filter['key'], $filter['operation'], $filter['value']);
            }
        }

        $functions = $queryBuilder->getFunctions();
        foreach ($functions as $func) {
            $func($modelDirectory);
        }

        if ($paginate->getActive()) {
            return $modelDirectory->paginate(
                $paginate->getLimit(),
                ['*'],
                'page',
                $paginate->getPage()
            );
        }

        return $modelDirectory->get();
    }
}