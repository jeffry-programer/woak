<?php

namespace App\Http\Controllers\Directory;

use App\Http\Controllers\Controller;
use App\Src\Services\Directory\GetAllDirectoriesServices; // Nota: Si tu servicio se llama GetAllDirectoriesServices, usa ese nombre aquí
use App\Src\Data\General\PaginateObject;
use App\Src\Data\General\QueryBuilder;
use Illuminate\Http\Request;
use App\Http\Requests\StoreDirectoryRequest; // Tu Form Request para store y update
use App\Src\Services\Directory\CreateDirectoryServices; // Servicio de creación
use App\Src\Services\Directory\GetOneDirectoryServices; // Servicio para obtener uno
use App\Src\Services\Directory\UpdateDirectoryServices; // Servicio de actualización
use App\Src\Services\Directory\DeleteDirectoryServices; // Servicio de eliminación (mantenemos plural como lo tienes ahora)
use Illuminate\Support\Facades\Auth; // <-- Importa el Facade Auth

class DirectoryManagerController extends Controller
{
    public function index(Request $request, GetAllDirectoriesServices $getAllDirectoriesServices) // Asumo este nombre para el servicio de obtener todos
    {
        $queryBuilder = new QueryBuilder(true);
        $queryBuilder->setWith('unit');
        $queryBuilder->setWith('createdBy');
        $queryBuilder->setWith('editedBy'); 


        $paginateObject = new PaginateObject($request->limit ?? 10, true, $request->page ?? 1);
        $filters = $request->all();

        if (!empty($filters) && isset($filters['search_term'])) {
            $searchTerm = $filters['search_term'];
            $queryBuilder->where(function ($q) use ($searchTerm) {
                $q->where('name', 'like', '%' . $searchTerm . '%')
                  ->orWhereHas('unit', function ($unitQ) use ($searchTerm) {
                      $unitQ->where('unit_name', 'like', '%' . $searchTerm . '%');
                  });
            });
        }

        if (!empty($filters) && isset($filters['hospital_id']) && $filters['hospital_id'] !== 'null') {
            $queryBuilder->setQueryWhere('hospital_id', '=', $filters['hospital_id']);
        }


        return response()->json($getAllDirectoriesServices($queryBuilder, $paginateObject));
    }

    public function store(StoreDirectoryRequest $request, CreateDirectoryServices $createDirectoryServices)
    {
        try {
            $validatedData = $request->validated();

            $user = Auth::user();
            if ($user) {
                $validatedData['created_by'] = $user->name; 
                $validatedData['created_by_user_id'] = $user->id;
                $validatedData['last_edited_by'] = $user->name;
                $validatedData['last_edited_by_user_id'] = $user->id;
            } else {
            
            }

            $directory = $createDirectoryServices($validatedData);

            return response()->json([
                'status' => true,
                'message' => 'Entrada de directorio creada satisfactoriamente',
                'data' => $directory
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Error al crear entrada de directorio: ',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id, GetOneDirectoryServices $getOneDirectoryServices)
    {
        try {
            $directory = $getOneDirectoryServices($id);
            if (!$directory) {
                return response()->json([
                    'status' => false,
                    'message' => 'Entrada de directorio no encontrada',
                ], 404);
            }

            return response()->json($directory);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => false,
                'message' => 'Error al buscar entrada de directorio: ',
                'error' => $th->getMessage()
            ], 500);
        }
    }

    public function update(
        StoreDirectoryRequest $request, // Si sigues usando StoreDirectoryRequest para update, asegúrate de las reglas 'sometimes'
        $id,
        UpdateDirectoryServices $updateDirectoryServices,
        GetOneDirectoryServices $getOneDirectoryServices
    ) {
        try {
            $directory = $getOneDirectoryServices($id);
            if (!$directory) {
                return response()->json([
                    'status' => false,
                    'message' => 'Entrada de directorio no encontrada',
                ], 404);
            }

            $validatedData = $request->validated();

            // *** Capturar el usuario autenticado y añadir campos de auditoría al editar ***
            $user = Auth::user(); // Obtiene el objeto del usuario autenticado
            if ($user) {
                $validatedData['last_edited_by'] = $user->name; // Asume que el nombre del usuario está en la columna 'name'
                $validatedData['last_edited_by_user_id'] = $user->id;
            } else {
                // Manejar el caso donde no hay usuario autenticado
            }
            // *************************************************************************

            $directory = $updateDirectoryServices($validatedData, $id);

            return response()->json([
                'status' => true,
                'message' => 'Entrada de directorio actualizada satisfactoriamente',
                'data' => $directory
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => false,
                'message' => 'Error al actualizar entrada de directorio: ',
                'error' => $th->getMessage()
            ], 500);
        }
    }

    public function destroy($id, DeleteDirectoryServices $deleteDirectoryServices, GetOneDirectoryServices $getOneDirectoryServices)
    {
        try {
            $directory = $getOneDirectoryServices($id);
            if (!$directory) {
                return response()->json([
                    'status' => false,
                    'message' => 'Entrada de directorio no encontrada',
                ], 404);
            }

            // Nota: Aquí usas $deleteDirectoryService($id); la variable es $deleteDirectoryServices
            // Asegúrate que los nombres coincidan: $deleteDirectoryServices($id);
            $deleteDirectoryServices($id); // <-- CORREGIDO el nombre de la variable de servicio

            return response()->json([
                'status' => true,
                'message' => 'Entrada de directorio eliminada satisfactoriamente',
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => false,
                'message' => 'Error al eliminar entrada de directorio: ',
                'error' => $th->getMessage()
            ], 500);
        }
    }
}