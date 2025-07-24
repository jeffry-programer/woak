<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Service\ServiceManagerController;

Route::group(['prefix' => 'service'], function () {
    Route::get('/', [ServiceManagerController::class, 'index']);
    Route::post('/', [ServiceManagerController::class, 'store']);
    Route::put('/{id}', [ServiceManagerController::class, 'update']);
    Route::delete('/{id}', [ServiceManagerController::class, 'destroy']);
    Route::get('/{id}', [ServiceManagerController::class, 'show']);

    Route::post('/attach-units/{service_id}', [ServiceManagerController::class, 'attachUnitsToServices']);
});
