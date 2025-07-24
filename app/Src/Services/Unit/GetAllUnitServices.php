<?php

namespace App\Src\Services\Unit;

use App\Models\Unit;
use App\Src\Data\General\QueryBuilder;
use App\Src\Data\General\PaginateObject;

class GetAllUnitServices
{
    public function __invoke(QueryBuilder $queryBuilder, PaginateObject $paginate)
    {
        $modelUnit = Unit::query();

        foreach ($queryBuilder->getWiths() as $with) {
            $modelUnit->with($with);
        }

        if ($queryBuilder->active()) {
            foreach ($queryBuilder->getQuerys() as $filter) {
                $modelUnit = $modelUnit->where($filter['key'], $filter['operation'], $filter['value']);
            }
        }

        $functions = $queryBuilder->getFunctions();
        foreach ($functions as $func) {
            $func($modelUnit);
        }

        if ($paginate->getActive()) {
            return $modelUnit->paginate($paginate->getLimit(), ['*'], 'page', $paginate->getPage());
        }

        return $modelUnit->get();
    }
}
