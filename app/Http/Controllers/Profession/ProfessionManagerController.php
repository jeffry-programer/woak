<?php

namespace App\Http\Controllers\Profession;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Src\Services\Professions\GetAllProfessionServices;
use App\Src\Services\CategoryProfession\GetAllCategoryProfessionServices;
use App\Src\Data\General\QueryBuilder;
use App\Src\Data\General\PaginateObject;

class ProfessionManagerController extends Controller
{
    public function index(Request $request, GetAllProfessionServices $getAllProfessionServices)
    {
        $queryBuilder = new QueryBuilder(true);
        $paginate = new PaginateObject(0, false, 0);
        $filters = $request->all();
        if (!empty($filters) && isset($filters['category_profession'])) {
            $queryBuilder->setFunction(function ($model) use ($filters) {
                $model->whereHas('categoryProfession', function ($query) use ($filters) {
                    $query->where('title', 'ilike', '%' . $filters['category_profession'] . '%');
                });
            });
        }

        $queryBuilder->setWith(['categoryProfession']);
        $professions = $getAllProfessionServices($queryBuilder, $paginate);
        return response()->json($professions);
    }

    public function getCategoriesProfessions(GetAllCategoryProfessionServices $getAllCategoryProfessionServices)
    {
        $queryBuilder = new QueryBuilder(true);
        $paginate = new PaginateObject(0, false, 0);
        $categoriesProfessions = $getAllCategoryProfessionServices($queryBuilder, $paginate);
        return response()->json($categoriesProfessions);
    }
}
