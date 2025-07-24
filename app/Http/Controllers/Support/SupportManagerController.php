<?php

namespace App\Http\Controllers\Support;
use App\Http\Controllers\Controller;
use App\Src\Services\Support\GetAllSupportServices;
use App\Src\Data\General\PaginateObject;
use App\Src\Data\General\QueryBuilder;
use Illuminate\Http\Request;
use App\Http\Requests\StoreSupportRequest;
use App\Src\Services\Support\CreateSupportServices;
use App\Src\Services\Support\GetOneSupportServices;
use App\Src\Services\Support\UpdateSupportServices;
use App\Src\Services\Support\DeleteSupportServices;
use Inertia\Inertia;

class SupportManagerController extends Controller
{
    public function index(Request $request, GetAllSupportServices $getAllSupportServices)
    {

        $queryBuilder = new QueryBuilder(true);
        $paginateObject = new PaginateObject($request->limit ?? 10, true, $request->page ?? 1);
        $filters = $request->all();

        if(!empty($filters) && isset($filters['hospital_id'])){
            $queryBuilder->setQueryWhere('hospital_id', '=', $filters['hospital_id']);
        }

        if (!empty($filters) && isset($filters['subject'])) {
            $queryBuilder->setQueryWhere('subject', 'like', '%' . $filters['subject'] . '%');
        }

        return response()->json($getAllSupportServices($queryBuilder, $paginateObject));
    }

    public function store(StoreSupportRequest $request, CreateSupportServices $createSupportServices)
    {
        try {
            $support = $createSupportServices($request->validated());
            return response()->json([
                'status' => true,
                'message' => 'Ticket de soporte creado satisfactoriamente',
                'data' => $support
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Error al crear ticket de soporte: ',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id, GetOneSupportServices $showSupportServices)
    {
        try {
            $support = $showSupportServices($id);
            if (!$support) {
                return response()->json([
                    'status' => false,
                    'message' => 'Ticket de soporte no encontrado',
                ], 404);
            }

            return response()->json($support);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => false,
                'message' => 'Error al buscar ticket de soporte: ',
                'error' => $th->getMessage()
            ], 500);
        }
    }

    public function update(
        StoreSupportRequest $request,
        $id,
        UpdateSupportServices $updateSupportServices,
        GetOneSupportServices $showSupportServices
    )
    {
        try {
            $support = $showSupportServices($id);
            if (!$support) {
                return response()->json([
                    'status' => false,
                    'message' => 'Ticket de soporte no encontrado',
                ], 404);
            }

            $support = $updateSupportServices($request->validated(), $id);

            return response()->json([
                'status' => true,
                'message' => 'Ticket de soporte actualizado satisfactoriamente',
                'data' => $support
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => false,
                'message' => 'Error al actualizar ticket de soporte: ',
                'error' => $th->getMessage()
            ], 500);
        }
    }

    public function destroy($id, DeleteSupportServices $deleteSupportService, GetOneSupportServices $showSupportServices)
    {
        try {
            $support = $showSupportServices($id);
            if (!$support) {
                return response()->json([
                    'status' => false,
                    'message' => 'Ticket de soporte no encontrado',
                ], 404);
            }

            $deleteSupportService($id);

            return response()->json([
                'status' => true,
                'message' => 'Ticket de soporte eliminado satisfactoriamente',
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => false,
                'message' => 'Error al buscar ticket de soporte: ',
                'error' => $th->getMessage()
            ], 500);
        }
    }
}
