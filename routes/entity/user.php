<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\User\UserManagerController;

Route::group(['prefix' => 'user'], function () {
    Route::get('/', [UserManagerController::class, 'index']);
    Route::post('/', [UserManagerController::class, 'store']);
    Route::put('/{id}', [UserManagerController::class, 'update']);
    Route::delete('/{id}', [UserManagerController::class, 'destroy']);
    Route::get('/{id}', [UserManagerController::class, 'show']);
    Route::post('/{id}/restore', [UserManagerController::class, 'restore']);
    Route::delete('/{id}/force', [UserManagerController::class, 'forceDelete']);
});
