<?php

namespace App\Http\Controllers\HospitalUser;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Src\Services\HospitalUser\CreateHospitalUserServices;
use App\Src\Services\HospitalUser\UpdateHospitalUserServices;
use App\Src\Services\HospitalUser\DeleteHospitalUserServices;
use App\Src\Services\HospitalUser\GetHospitalUserServices;
use App\Src\Services\HospitalUser\GetAllHospitalUserServices;
use App\Src\Services\User\CreateUserServices;
use App\Src\Data\General\QueryBuilder;
use App\Src\Data\General\PaginateObject;
use Illuminate\Support\Facades\DB;
use App\Models\User;

class HospitalUserManagerController extends Controller
{
    public function index(Request $request, GetAllHospitalUserServices $getAllHospitalUserServices)
    {
        $queryBuilder = new QueryBuilder(true);
        $paginate = new PaginateObject($request->limit ?? 15, true, $request->page ?? 1);

        if ($request->has('hospital_id')) {
            $queryBuilder->setQueryWhere('hospital_id', '=', $request->hospital_id);
        }

        return response()->json($getAllHospitalUserServices($queryBuilder, $paginate));
    }

    public function show(int $id, GetHospitalUserServices $getHospitalUserServices)
    {
        try {
            $hospitalUser = $getHospitalUserServices($id);
            if (!$hospitalUser) {
                return response()->json([
                    'message' => 'Usuario de hospital no encontrado',
                ], 404);
            }
            return response()->json($hospitalUser);
        } catch (\Throwable $th) {
            return response()->json([
                'message' => 'Error al obtener el usuario de hospital',
            ], 500);
        }
    }

    public function store(Request $request, CreateHospitalUserServices $createHospitalUserServices)
    {
        try {
            $validate = $request->validate([
                'hospital_id' => 'required',
                'user_id' => 'required',
                'type_user' => 'required|in:owner,worker',
                'profession_id' => 'required',
                'unit_id' => 'required',
                'status' => 'boolean|nullable'
            ]);
            $createHospitalUserServices($validate);
            return response()->json([
                'message' => 'Usuario de hospital creado correctamente',
            ], 201);
        } catch (\Throwable $th) {
            return response()->json([
                'message' => 'Error al crear el usuario de hospital',
                'error' => $th->getMessage(),
            ], 500);
        }
    }

    public function storeWithUser(
        Request $request,
        CreateUserServices $createUserServices,
        CreateHospitalUserServices $createHospitalUserServices
    ) {
        try {
            DB::beginTransaction();
            $validate = $request->validate([
                'hospital_id' => 'required',
                'type_user' => 'required|in:owner,worker',
                'profession_id' => 'required',
                'unit_id' => 'required',
                'status' => 'boolean|nullable',
                'name' => 'required|string',
                'email' => 'required',
                'password' => 'required|min:8',
            ]);

            $existingUser = User::where('email', $validate['email'])->first();

            if ($existingUser) {
                $userId = $existingUser->id;
            } else {
                $user = $createUserServices([
                    'name' => $validate['name'],
                    'email' => $validate['email'],
                    'password' => bcrypt($validate['password']),
                ]);
                $userId = $user->id;
            }

            $validate['user_id'] = $userId;
            $createHospitalUserServices([
                'hospital_id' => $validate['hospital_id'],
                'type_user' => $validate['type_user'],
                'profession_id' => $validate['profession_id'],
                'unit_id' => $validate['unit_id'],
                'status' => $validate['status'],
                'user_id' => $userId,
            ]);
            DB::commit();
            return response()->json([
                'message' => 'Usuario de hospital creado correctamente',
            ], 201);
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'message' => 'Error al crear el usuario de hospital',
                'error' => $th->getMessage(),
            ], 500);
        }
    }

    public function update(Request $request, int $id, UpdateHospitalUserServices $updateHospitalUserServices, GetHospitalUserServices $getHospitalUserServices)
    {
        try {
            $hospitalUser = $getHospitalUserServices($id);
            if (!$hospitalUser) {
                return response()->json([
                    'message' => 'Usuario de hospital no encontrado',
                ], 404);
            }
            $hospitalUser = $updateHospitalUserServices($request->all(), $id);
            return response()->json([
                'message' => 'Usuario de hospital actualizado correctamente',
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'message' => 'Error al actualizar el usuario de hospital',
                'error' => $th->getMessage(),
            ], 500);
        }
    }

    public function delete(int $id, DeleteHospitalUserServices $deleteHospitalUserServices, GetHospitalUserServices $getHospitalUserServices)
    {
        try {
            $hospitalUser = $getHospitalUserServices($id);
            if (!$hospitalUser) {
                return response()->json([
                    'message' => 'Usuario de hospital no encontrado',
                ], 404);
            }
            $hospitalUser = $deleteHospitalUserServices($id);
            return response()->json([
                'message' => 'Usuario de hospital eliminado correctamente',
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'message' => 'Error al eliminar el usuario de hospital',
            ], 500);
        }
    }
}
