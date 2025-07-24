<?php

namespace App\Http\Controllers\Hospital;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Src\Services\Hospital\CreateHospitalServices;
use App\Src\Services\Hospital\UpdateHospitalServices;
use App\Src\Services\Hospital\DeleteHospitalServices;
use App\Src\Services\Hospital\GetOneHospitalServices;
use App\Src\Services\Hospital\GetAllHospitalServices;
use App\Src\Services\Hospital\RestoreHospitalServices;
use App\Src\Services\Hospital\ForceDeleteHospitalServices;
use App\Src\Data\General\PaginateObject;
use App\Src\Data\General\QueryBuilder;
use App\Src\Services\File\FileServices;
use Illuminate\Support\Facades\DB;

class HospitalManagerController extends Controller
{
    public function index(Request $request, GetAllHospitalServices $getAllHospitalServices)
    {
        $queryBuilder = new QueryBuilder(true);
        $paginateObject = new PaginateObject($request->limit ?? 10, true, $request->page ?? 1);
        $filters = $request->all();

        if (!empty($filters) && isset($filters['code'])) {
            $queryBuilder->setQueryWhere('hospital_code', 'like', '%' . $filters['code'] . '%');
        }

        if (!empty($filters) && isset($filters['name'])) {
            $queryBuilder->setQueryWhere('hospital_name', 'like', '%' . $filters['name'] . '%');
        }

        if (!empty($filters) && isset($filters['user_id'])) {
            $queryBuilder->setFunction(function ($model) use ($filters) {
                $model->whereHas('hospitalUsers', function ($query) use ($filters) {
                    $query->where('user_id', $filters['user_id']);
                });
            });

            $queryBuilder->setWith('hospitalUsers', function ($query) use ($filters) {
                $query->where('user_id', $filters['user_id']);
                $query->with(['profession']);
            });
        }

        return response()->json($getAllHospitalServices($queryBuilder, $paginateObject, (!empty($filters) && isset($filters['trashed']))));
    }

    public function store(
        Request $request,
        CreateHospitalServices $createHospitalServices,
        FileServices $fileServices
    ) {
        $validate = $request->validate([
            'hospital_code' => 'required|string|max:50|unique:hospitals',
            'hospital_name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'general_details' => 'nullable|string',
            'location' => 'required|string|max:100',
            'latitude' => 'required|string|max:20',
            'longitude' => 'required|string|max:20',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        try {
            DB::beginTransaction();
            if (!$request->has('image')) {
                return response()->json([
                    'status' => false,
                    'message' => 'Error al crear hospital: ',
                    'error' => 'No se proporciono una imagen'
                ], 500);
            }

            $file = $fileServices->uploadFile($request->file('image'));

            $hospital = $createHospitalServices($validate);

            // Create and associate the file record with the hospital
            $hospital->image()->create([
                'name' => $file['name'],
                'size' => $file['size'],
                'type' => $file['type'],
                'path_local' => $file['url_local'],
                'entity_id' => $hospital->id
            ]);

            DB::commit();
            return response()->json(['message' => 'Hospital creado satisfactoriamente', 'data' => $hospital]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 500,
                'message' => 'Error al crear hospital: ',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(
        Request $request,
        $id,
        UpdateHospitalServices $updateHospitalServices,
        GetOneHospitalServices $showHospitalServices
    ) {

        try {
            $hospital = $showHospitalServices($id);
            if (!$hospital) {
                return response()->json([
                    'status' => false,
                    'message' => 'Hospital no encontrado',
                ], 404);
            }

            $hospital = $updateHospitalServices($request->all(), $id);

            return response()->json([
                'status' => true,
                'message' => 'Hospital actualizado satisfactoriamente',
                'data' => $hospital
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => false,
                'message' => 'Error al actualizar hospital: ',
                'error' => $th->getMessage()
            ], 500);
        }
    }

    public function destroy(Request $request, $id, DeleteHospitalServices $deleteHospitalServices, GetOneHospitalServices $showHospitalServices)
    {
        try {
            $hospital = $showHospitalServices($id);
            if (!$hospital) {
                return response()->json([
                    'status' => false,
                    'message' => 'Hospital no encontrado',
                ], 404);
            }

            $deleteHospitalServices($id);

            return response()->json([
                'status' => true,
                'message' => 'Hospital eliminado satisfactoriamente',
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => false,
                'message' => 'Error al buscar hospital: ',
                'error' => $th->getMessage()
            ], 500);
        }
    }

    public function forceDelete(Request $request, $id, DeleteHospitalServices $deleteHospitalServices)
    {
        try {
            $deleteHospitalServices($id, true);

            return response()->json([
                'status' => true,
                'message' => 'Hospital eliminado satisfactoriamente',
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => false,
                'message' => 'Error al buscar hospital: ',
                'error' => $th->getMessage()
            ], 500);
        }
    }

    public function restore(Request $request, $id, RestoreHospitalServices $restoreHospitalServices)
    {
        try {
            $restoreHospitalServices($id);

            return response()->json([
                'status' => true,
                'message' => 'Hospital restaurado satisfactoriamente',
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => false,
                'message' => 'Error al restaurar hospital: ',
                'error' => $th->getMessage()
            ], 500);
        }
    }

    public function show($id, GetOneHospitalServices $showHospitalServices)
    {
        try {
            $hospital = $showHospitalServices($id);
            if (!$hospital) {
                return response()->json([
                    'status' => false,
                    'message' => 'Hospital no encontrado',
                ], 404);
            }

            return response()->json($hospital);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => false,
                'message' => 'Error al buscar hospital: ',
                'error' => $th->getMessage()
            ], 500);
        }
    }
}
