<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Hospital\HospitalManagerController;

Route::group(['prefix' => 'hospital'], function () {
    Route::get('/', [HospitalManagerController::class, 'index']);
    Route::post('/', [HospitalManagerController::class, 'store']);
    Route::put('/{id}', [HospitalManagerController::class, 'update']);
    Route::delete('/{id}', [HospitalManagerController::class, 'destroy']);
    Route::get('/{id}', [HospitalManagerController::class, 'show']);

    Route::post('/{id}/restore', [HospitalManagerController::class, 'restore']);
    Route::delete('/{id}/force', [HospitalManagerController::class, 'forceDelete']);
});
