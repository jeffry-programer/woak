<?php

namespace App\Http\Controllers\SubService;
use App\Http\Controllers\Controller;
use App\Src\Services\SubService\GetAllSubServiceServices;
use App\Src\Data\General\PaginateObject;
use App\Src\Data\General\QueryBuilder;
use Illuminate\Http\Request;
use App\Http\Requests\StoreSubServiceStore;
use App\Src\Services\SubService\CreateSubServiceServices;
use App\Src\Services\SubService\GetOneSubServiceServices;
use App\Src\Services\SubService\UpdateSubServiceServices;
use App\Src\Services\SubService\DeleteSubServiceServices;
use Inertia\Inertia;

class SubServiceManagerController extends Controller
{
    public function index(Request $request, GetAllSubServiceServices $getAllSubServiceServices)
    {

        $queryBuilder = new QueryBuilder(true);
        $filters = $request->all();
        $queryBuilder->setFunction(function ($model) use ($filters) {
            $model->whereHas('service', function ($query) use ($filters) {
                $query->where('hospital_id', '=', $filters['hospital_id']);
            });
        });
        
        $paginateObject = new PaginateObject($request->limit ?? 10, true, $request->page ?? 1);
        
        if (!empty($filters) && isset($filters['sub_service_name'])) {
            $queryBuilder->setQueryWhere('sub_service_name', 'like', '%' . $filters['sub_service_name'] . '%');
        }

        return response()->json($getAllSubServiceServices($queryBuilder, $paginateObject));

    }

    public function store(StoreSubServiceStore $request, CreateSubServiceServices $createSubServiceServices)
    {
        try {
            $subService = $createSubServiceServices($request->validated());
            return response()->json([
                'status' => true,
                'message' => 'SubServicio creado satisfactoriamente',
                'data' => $subService
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Error al crear subServicio: ',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id, GetOneSubServiceServices $showSubServiceServices)
    {
        try {
            $subService = $showSubServiceServices($id);
            if (!$subService) {
                return response()->json([
                    'status' => false,
                    'message' => 'SubServicio no encontrado',
                ], 404);
            }

            return response()->json($subService);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => false,
                'message' => 'Error al buscar subServicio: ',
                'error' => $th->getMessage()
            ], 500);
        }
    }

    public function update(
        StoreSubServiceStore $request,
        $id,
        UpdateSubServiceServices $updateSubServiceServices,
        GetOneSubServiceServices $showSubServiceServices
    )
    {
        try {
            $subService = $showSubServiceServices($id);
            if (!$subService) {
                return response()->json([
                    'status' => false,
                    'message' => 'SubServicio no encontrado',
                ], 404);
            }

            $subService = $updateSubServiceServices($request->validated(), $id);

            return response()->json([
                'status' => true,
                'message' => 'SubServicio actualizado satisfactoriamente',
                'data' => $subService
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => false,
                'message' => 'Error al actualizar subServicio: ',
                'error' => $th->getMessage()
            ], 500);
        }
    }

    public function destroy($id, DeleteSubServiceServices $deleteSubServiceServices, GetOneSubServiceServices $showSubServiceServices)
    {
        try {
            $subService = $showSubServiceServices($id);
            if (!$subService) {
                return response()->json([
                    'status' => false,
                    'message' => 'SubServicio no encontrado',
                ], 404);
            }

            $deleteSubServiceServices($id);

            return response()->json([
                'status' => true,
                'message' => 'SubServicio eliminado satisfactoriamente',
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => false,
                'message' => 'Error al buscar subServicio: ',
                'error' => $th->getMessage()
            ], 500);
        }
    }

}