<?php

namespace App\Src\Services\Service;

use App\Models\Service;
use App\Src\Data\General\QueryBuilder;
use App\Src\Data\General\PaginateObject;

class GetAllServiceServices
{
    public function __invoke(QueryBuilder $queryBuilder, PaginateObject $paginate)
    {
        $modelService = Service::query();

        foreach ($queryBuilder->getWiths() as $with) {
            $modelService->with($with);
        }

        if ($queryBuilder->active()) {
            foreach ($queryBuilder->getQuerys() as $filter) {
                $modelService = $modelService->where($filter['key'], $filter['operation'], $filter['value']);
            }
        }

        $functions = $queryBuilder->getFunctions();
        foreach ($functions as $func) {
            $func($modelService);
        }

        if ($paginate->getActive()) {
            return $modelService->paginate($paginate->getLimit(), ['*'], 'page', $paginate->getPage());
        }

        return $modelService->get();
    }
}
