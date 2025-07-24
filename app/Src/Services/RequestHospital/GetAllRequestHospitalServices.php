<?php

namespace App\Src\Services\RequestHospital;

use App\Models\RequestHospital;
use App\Src\Data\General\QueryBuilder;
use App\Src\Data\General\PaginateObject;

class GetAllRequestHospitalServices
{
    public function __invoke(QueryBuilder $queryBuilder, PaginateObject $paginate, $trashed = false)
    {
        if($trashed){
            $modelRequestHospital = RequestHospital::onlyTrashed();
        }else{
            $modelRequestHospital = RequestHospital::query();
        }

        foreach ($queryBuilder->getWiths() as $with) {
            $modelRequestHospital->with($with);
        }

        if ($queryBuilder->active()) {
            foreach ($queryBuilder->getQuerys() as $filter) {
                $modelRequestHospital = $modelRequestHospital->where($filter['key'], $filter['operation'], $filter['value']);
            }
        }

        $functions = $queryBuilder->getFunctions();
        foreach ($functions as $func) {
            $func($modelRequestHospital);
        }

        if ($paginate->getActive()) {
            return $modelRequestHospital->paginate($paginate->getLimit(), ['*'], 'page', $paginate->getPage());
        }

        return $modelRequestHospital->get();
    }
}
