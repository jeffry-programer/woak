<?php

namespace App\Http\Controllers\User;
use App\Http\Controllers\Controller;
use App\Src\Services\User\GetAllUserServices;
use App\Src\Data\General\PaginateObject;
use App\Src\Data\General\QueryBuilder;
use Illuminate\Http\Request;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Src\Services\User\CreateUserServices;
use App\Src\Services\User\GetOneUserServices;
use App\Src\Services\User\UpdateUserServices;
use App\Src\Services\User\DeleteUserServices;
use App\Src\Services\User\RestoreUserServices;
use Inertia\Inertia;

class UserManagerController extends Controller
{
    public function index(Request $request, GetAllUserServices $getAllUserServices)
    {

        $queryBuilder = new QueryBuilder(true);
        $paginateObject = new PaginateObject($request->limit ?? 10, true, $request->page ?? 1);
        $filters = $request->all();

        if (!empty($filters) && isset($filters['name'])) {
            $queryBuilder->setQueryWhere('name', 'like', '%' . $filters['name'] . '%');
        }

        return response()->json($getAllUserServices($queryBuilder, $paginateObject, (!empty($filters) && isset($filters['trashed']))));
    }

    public function store(StoreUserRequest $request, CreateUserServices $createUserServices)
    {
        try {
            $postData = $request->validated();
            $postData['password'] = bcrypt($postData['password']);
            $user = $createUserServices($postData);
            return response()->json([
                'status' => true,
                'message' => 'Usuario creado satisfactoriamente',
                'data' => $user
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Error al crear unidad: ',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id, GetOneUserServices $showUserServices)
    {
        try {
            $user = $showUserServices($id);
            if (!$user) {
                return response()->json([
                    'status' => false,
                    'message' => 'Usuario no encontrado',
                ], 404);
            }

            return response()->json($user);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => false,
                'message' => 'Error al buscar usuario: ',
                'error' => $th->getMessage()
            ], 500);
        }
    }

    public function update(
        UpdateUserRequest $request,
        $id,
        UpdateUserServices $updateUserServices,
        GetOneUserServices $showUserServices
    )
    {
        try {
            $user = $showUserServices($id);
            if (!$user) {
                return response()->json([
                    'status' => false,
                    'message' => 'Usuario no encontrado',
                ], 404);
            }

            $postData = $request->validated();
            if(array_key_exists('password', $postData) && trim($postData['password']) == '') {
                unset($postData['password']);
            }

            $user = $updateUserServices($postData, $id);

            return response()->json([
                'status' => true,
                'message' => 'Usuario actualizado satisfactoriamente',
                'data' => $user
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => false,
                'message' => 'Error al actualizar usuario: ',
                'error' => $th->getMessage()
            ], 500);
        }
    }

    public function destroy($id, DeleteUserServices $deleteUserService, GetOneUserServices $showUserServices)
    {
        try {
            $user = $showUserServices($id);
            if (!$user) {
                return response()->json([
                    'status' => false,
                    'message' => 'Usuario no encontrado',
                ], 404);
            }

            $deleteUserService($id);

            return response()->json([
                'status' => true,
                'message' => 'Usuario eliminado satisfactoriamente',
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => false,
                'message' => 'Error al eliminar usuario: ',
                'error' => $th->getMessage()
            ], 500);
        }
    }

    public function forceDelete(Request $request, $id, DeleteUserServices $deleteUserService)
    {
        try {
            $deleteUserService($id, true);

            return response()->json([
                'status' => true,
                'message' => 'Usuario eliminado satisfactoriamente',
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => false,
                'message' => 'Error al eliminar usuario: ',
                'error' => $th->getMessage()
            ], 500);
        }
    }

    public function restore(Request $request, $id, RestoreUserServices $restoreUserService)
    {
        try {
            $restoreUserService($id);

            return response()->json([
                'status' => true,
                'message' => 'Usuario restaurado satisfactoriamente',
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => false,
                'message' => 'Error al restaurar usuario: ',
                'error' => $th->getMessage()
            ], 500);
        }
    }
}
