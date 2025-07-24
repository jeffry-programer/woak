<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Unit\UnitManagerController;

Route::group(['prefix' => 'unit'], function () {
    Route::get('/', [UnitManagerController::class, 'index']);
    Route::post('/', [UnitManagerController::class, 'store']);
    Route::put('/{id}', [UnitManagerController::class, 'update']);
    Route::delete('/{id}', [UnitManagerController::class, 'destroy']);
    Route::get('/{id}', [UnitManagerController::class, 'show']);
});
