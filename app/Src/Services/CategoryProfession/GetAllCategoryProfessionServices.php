<?php

namespace App\Src\Services\CategoryProfession;

use App\Models\CategoryProfession;
use App\Src\Data\General\QueryBuilder;
use App\Src\Data\General\PaginateObject;

class GetAllCategoryProfessionServices
{
    public function __invoke(QueryBuilder $queryBuilder, PaginateObject $paginate)
    {
        $modelProfession = CategoryProfession::query();

        foreach ($queryBuilder->getWiths() as $with) {
            $modelProfession->with($with);
        }

        if ($queryBuilder->active()) {
            foreach ($queryBuilder->getQuerys() as $filter) {
                $modelProfession = $modelProfession->where($filter['key'], $filter['operation'], $filter['value']);
            }
        }

        $functions = $queryBuilder->getFunctions();
        foreach ($functions as $func) {
            $func($modelProfession);
        }

        if ($paginate->getActive()) {
            return $modelProfession->paginate($paginate->getLimit(), ['*'], 'page', $paginate->getPage());
        }

        return $modelProfession->get();
    }
}
