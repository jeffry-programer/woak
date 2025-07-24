<?php

namespace App\Src\Services\Support;

use App\Models\Support;
use App\Src\Data\General\QueryBuilder;
use App\Src\Data\General\PaginateObject;

class GetAllSupportServices
{
    public function __invoke(QueryBuilder $queryBuilder, PaginateObject $paginate)
    {
        $modelSupport = Support::query();

        foreach ($queryBuilder->getWiths() as $with) {
            $modelSupport->with($with);
        }

        if ($queryBuilder->active()) {
            foreach ($queryBuilder->getQuerys() as $filter) {
                $modelSupport = $modelSupport->where($filter['key'], $filter['operation'], $filter['value']);
            }
        }

        $functions = $queryBuilder->getFunctions();
        foreach ($functions as $func) {
            $func($modelSupport);
        }

        if ($paginate->getActive()) {
            return $modelSupport->paginate($paginate->getLimit(), ['*'], 'page', $paginate->getPage());
        }

        return $modelSupport->get();
    }
}
