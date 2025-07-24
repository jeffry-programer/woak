<?php

namespace App\Src\Services\HospitalUser;

use App\Models\HospitalUser;
use App\Src\Data\General\QueryBuilder;
use App\Src\Data\General\PaginateObject;

class GetAllHospitalUserServices
{
    public function __invoke(QueryBuilder $queryBuilder, PaginateObject $paginate)
    {
        $modelHospitalUser = HospitalUser::query();

        foreach ($queryBuilder->getWiths() as $with) {
            $modelHospitalUser->with($with);
        }

        if ($queryBuilder->active()) {
            foreach ($queryBuilder->getQuerys() as $filter) {
                $modelHospitalUser = $modelHospitalUser->where($filter['key'], $filter['operation'], $filter['value']);
            }
        }

        $functions = $queryBuilder->getFunctions();
        foreach ($functions as $func) {
            $func($modelHospitalUser);
        }

        if ($paginate->getActive()) {
            return $modelHospitalUser->paginate($paginate->getLimit(), ['*'], 'page', $paginate->getPage());
        }

        return $modelHospitalUser->get();
    }
}
