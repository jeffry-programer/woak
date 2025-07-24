<?php

namespace App\Http\Controllers\Service;

use App\Http\Controllers\Controller;
use App\Src\Services\Service\GetAllServiceServices;
use App\Src\Data\General\PaginateObject;
use App\Src\Data\General\QueryBuilder;
use Illuminate\Http\Request;
use App\Http\Requests\StoreServiceRequest;
use App\Src\Services\Service\CreateServiceServices;
use App\Src\Services\Service\GetOneServiceServices;
use App\Src\Services\Service\UpdateServiceServices;
use App\Src\Services\Service\DeleteServiceServices;
use App\Src\Services\File\FileServices;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ServiceManagerController extends Controller
{
    public function index(Request $request, GetAllServiceServices $getAllServiceServices)
    {

        $queryBuilder = new QueryBuilder(true);
        $paginateObject = new PaginateObject($request->limit ?? 10, true, $request->page ?? 1);
        $filters = $request->all();

        if (!empty($filters) && isset($filters['hospital_id'])) {
            $queryBuilder->setQueryWhere('hospital_id', '=', $filters['hospital_id']);
        }

        if (!empty($filters) && isset($filters['service_name'])) {
            $queryBuilder->setQueryWhere('service_name', 'like', '%' . $filters['service_name'] . '%');
        }

        if ($request->has('units')) {
            $queryBuilder->setWith('units');
        }

        return response()->json($getAllServiceServices($queryBuilder, $paginateObject));
    }

    public function store(StoreServiceRequest $request, CreateServiceServices $createServiceServices, FileServices $fileServices)
    {
        try {
            DB::beginTransaction();

            $validated = $request->validated();

            if ($request->has('service_image')) {
                $file = $fileServices->uploadFile($request->file('service_image'));
            }

            $service = $createServiceServices($validated);

            // Create and associate the file record with the service if image was uploaded
            if (isset($file)) {
                $service->image()->create([
                    'name' => $file['name'],
                    'size' => $file['size'],
                    'type' => $file['type'],
                    'path_local' => $file['url_local'],
                    'entity_id' => $service->id
                ]);
            }

            DB::commit();
            return response()->json([
                'status' => true,
                'message' => 'Servicio creado satisfactoriamente',
                'data' => $service
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => false,
                'message' => 'Error al crear servicio: ',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id, GetOneServiceServices $showServiceServices)
    {
        try {
            $service = $showServiceServices($id);
            if (!$service) {
                return response()->json([
                    'status' => false,
                    'message' => 'Servicio no encontrado',
                ], 404);
            }

            return response()->json($service);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => false,
                'message' => 'Error al buscar servicio: ',
                'error' => $th->getMessage()
            ], 500);
        }
    }

    public function update(
        StoreServiceRequest $request,
        $id,
        UpdateServiceServices $updateServiceServices,
        GetOneServiceServices $showServiceServices
    ) {
        try {
            $service = $showServiceServices($id);
            if (!$service) {
                return response()->json([
                    'status' => false,
                    'message' => 'Servicio no encontrado',
                ], 404);
            }

            $service = $updateServiceServices($request->validated(), $id);

            return response()->json([
                'status' => true,
                'message' => 'Servicio actualizado satisfactoriamente',
                'data' => $service
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => false,
                'message' => 'Error al actualizar servicio: ',
                'error' => $th->getMessage()
            ], 500);
        }
    }

    public function destroy($id, DeleteServiceServices $deleteServiceServices, GetOneServiceServices $showServiceServices)
    {
        try {
            $service = $showServiceServices($id);
            if (!$service) {
                return response()->json([
                    'status' => false,
                    'message' => 'Servicio no encontrado',
                ], 404);
            }

            $deleteServiceServices($id);

            return response()->json([
                'status' => true,
                'message' => 'Servicio eliminado satisfactoriamente',
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => false,
                'message' => 'Error al buscar servicio: ',
                'error' => $th->getMessage()
            ], 500);
        }
    }

    public function attachUnitsToServices(Request $request, $service_id, GetOneServiceServices $showServiceServices)
    {
        try {
            $request->validate([
                'units' => 'required|array',
            ]);

            $service = $showServiceServices($service_id);
            if (!$service) {
                return response()->json([
                    'status' => false,
                    'message' => 'Servicio no encontrado',
                ], 404);
            }

            $service->units()->sync($request->units);

            return response()->json([
                'status' => true,
                'message' => 'Unidades agregadas al servicio satisfactoriamente',
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => false,
                'message' => 'Error al buscar servicio: ',
                'error' => $th->getMessage()
            ], 500);
        }
    }
}
