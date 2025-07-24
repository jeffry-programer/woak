<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Directory\DirectoryManagerController;


Route::group(['prefix' => 'directory'], function () {
    Route::get('/', [DirectoryManagerController::class, 'index']);
    Route::post('/', [DirectoryManagerController::class, 'store']);
    Route::put('/{id}', [DirectoryManagerController::class, 'update']);
    Route::delete('/{id}', [DirectoryManagerController::class, 'destroy']);
    Route::get('/{id}', [DirectoryManagerController::class, 'show']);
});