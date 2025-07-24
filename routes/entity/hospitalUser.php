<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HospitalUser\HospitalUserManagerController;

Route::group(['prefix' => 'hospitalUser'], function () {
    Route::get('/', [HospitalUserManagerController::class, 'index']);
    Route::post('/', [HospitalUserManagerController::class, 'store']);
    Route::post('/with-user', [HospitalUserManagerController::class, 'storeWithUser']);
    Route::put('/{id}', [HospitalUserManagerController::class, 'update']);
    Route::delete('/{id}', [HospitalUserManagerController::class, 'delete']);
    Route::get('/{id}', [HospitalUserManagerController::class, 'show']);
});
