<?php

namespace App\Src\Services\Hospital;

use App\Models\Hospital;
use App\Src\Data\General\QueryBuilder;
use App\Src\Data\General\PaginateObject;

class GetAllHospitalServices
{
    public function __invoke(QueryBuilder $queryBuilder, PaginateObject $paginate, $trashed = false)
    {
        if($trashed){
            $modelHospital = Hospital::onlyTrashed();
        }else{
            $modelHospital = Hospital::query();
        }

        foreach ($queryBuilder->getWiths() as $with) {
            $modelHospital->with($with);
        }

        if ($queryBuilder->active()) {
            foreach ($queryBuilder->getQuerys() as $filter) {
                $modelHospital = $modelHospital->where($filter['key'], $filter['operation'], $filter['value']);
            }
        }

        $functions = $queryBuilder->getFunctions();
        foreach ($functions as $func) {
            $func($modelHospital);
        }

        if ($paginate->getActive()) {
            return $modelHospital->paginate($paginate->getLimit(), ['*'], 'page', $paginate->getPage());
        }

        return $modelHospital->get();
    }
}
