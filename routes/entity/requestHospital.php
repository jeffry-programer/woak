<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Hospital\RequestHospitalController;

Route::group(['prefix' => 'requestHospital'], function () {
    Route::get('/', [RequestHospitalController::class, 'index']);
    Route::post('/', [RequestHospitalController::class, 'store']);
    Route::put('/{id}', [RequestHospitalController::class, 'update']);
    Route::delete('/{id}', [RequestHospitalController::class, 'destroy']);
    Route::get('/{id}', [RequestHospitalController::class, 'show']);
});
