<?php

namespace App\Http\Controllers\Unit;

use App\Http\Controllers\Controller;
use App\Src\Services\Unit\GetAllUnitServices;
use App\Src\Data\General\PaginateObject;
use App\Src\Data\General\QueryBuilder;
use Illuminate\Http\Request;
use App\Http\Requests\StoreUnitRequest;
use App\Src\Services\Unit\CreateUnitServices;
use App\Src\Services\Unit\GetOneUnitServices;
use App\Src\Services\Unit\UpdateUnitServices;
use App\Src\Services\Unit\DeleteUnitService;
use App\Src\Services\File\FileServices;
use Illuminate\Support\Facades\DB;

class UnitManagerController extends Controller
{
    public function index(Request $request, GetAllUnitServices $getAllUnitServices)
    {

        $queryBuilder = new QueryBuilder(true);
        $queryBuilder->setWith('hospital');
        $paginateObject = new PaginateObject($request->limit ?? 10, true, $request->page ?? 1);
        $filters = $request->all();

        if (!empty($filters) && isset($filters['hospital_id'])) {
            $queryBuilder->setQueryWhere('hospital_id', '=', $filters['hospital_id']);
        }

        if (!empty($filters) && isset($filters['unit_name'])) {
            $queryBuilder->setQueryWhere('unit_name', 'like', '%' . $filters['unit_name'] . '%');
        }

        if ($request->has('service_id')) {
            $queryBuilder->setFunction(function ($query) use ($request) {
                $query->whereHas('services', function ($q) use ($request) {
                    $q->where('services.id', '=', $request->service_id);
                });
            });
        }

        if ($request->has('services')) {
            $arrayServices = json_decode($request->services);
            $queryBuilder->setFunction(function ($query) use ($arrayServices) {
                $query->whereHas('services', function ($q) use ($arrayServices) {
                    $q->whereIn('services.id', $arrayServices);
                });
            });
        }

        return response()->json($getAllUnitServices($queryBuilder, $paginateObject));
    }

    public function store(StoreUnitRequest $request, CreateUnitServices $createUnitServices, FileServices $fileServices)
    {
        try {
            DB::beginTransaction();

            if (!$request->has('unit_image')) {
                return response()->json([
                    'status' => false,
                    'message' => 'Error al crear unidad: ',
                    'error' => 'No se proporcionó una imagen'
                ], 500);
            }

            $file = $fileServices->uploadFile($request->file('unit_image'));

            $unit = $createUnitServices($request->validated());

            // Create and associate the file record with the unit
            $unit->image()->create([
                'name' => $file['name'],
                'size' => $file['size'],
                'type' => $file['type'],
                'path_local' => $file['url_local'],
                'entity_id' => $unit->id
            ]);

            DB::commit();

            return response()->json([
                'status' => true,
                'message' => 'Unidad creada satisfactoriamente',
                'data' => $unit
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => false,
                'message' => 'Error al crear unidad: ',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id, GetOneUnitServices $showUnitServices)
    {
        try {
            $unit = $showUnitServices($id);
            if (!$unit) {
                return response()->json([
                    'status' => false,
                    'message' => 'Hospital no encontrado',
                ], 404);
            }

            return response()->json($unit);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => false,
                'message' => 'Error al buscar unidad: ',
                'error' => $th->getMessage()
            ], 500);
        }
    }

    public function update(
        StoreUnitRequest $request,
        $id,
        UpdateUnitServices $updateUnitServices,
        GetOneUnitServices $showUnitServices
    ) {
        try {
            $unit = $showUnitServices($id);
            if (!$unit) {
                return response()->json([
                    'status' => false,
                    'message' => 'Unidad no encontrada',
                ], 404);
            }

            $unit = $updateUnitServices($request->validated(), $id);

            return response()->json([
                'status' => true,
                'message' => 'Unidad actualizada satisfactoriamente',
                'data' => $unit
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => false,
                'message' => 'Error al actualizar unidad: ',
                'error' => $th->getMessage()
            ], 500);
        }
    }

    public function destroy($id, DeleteUnitService $deleteUnitService, GetOneUnitServices $showUnitServices)
    {
        try {
            $unit = $showUnitServices($id);
            if (!$unit) {
                return response()->json([
                    'status' => false,
                    'message' => 'Unidad no encontrada',
                ], 404);
            }

            $deleteUnitService($id);

            return response()->json([
                'status' => true,
                'message' => 'Unidad eliminada satisfactoriamente',
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => false,
                'message' => 'Error al buscar unidad: ',
                'error' => $th->getMessage()
            ], 500);
        }
    }
}
