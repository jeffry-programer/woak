<?php

namespace App\Src\Services\SubService;

use App\Models\SubService;
use App\Src\Data\General\QueryBuilder;
use App\Src\Data\General\PaginateObject;

class GetAllSubServiceServices
{
    public function __invoke(QueryBuilder $queryBuilder, PaginateObject $paginate)
    {
        $modelSubService = SubService::query();

        foreach ($queryBuilder->getWiths() as $with) {
            $modelSubService->with($with);
        }

        if ($queryBuilder->active()) {
            foreach ($queryBuilder->getQuerys() as $filter) {
                $modelSubService = $modelSubService->where($filter['key'], $filter['operation'], $filter['value']);
            }
        }

        $functions = $queryBuilder->getFunctions();
        foreach ($functions as $func) {
            $func($modelSubService);
        }

        if ($paginate->getActive()) {
            return $modelSubService->paginate($paginate->getLimit(), ['*'], 'page', $paginate->getPage());
        }

        return $modelSubService->get();
    }
}
