<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SubService\SubServiceManagerController;

Route::group(['prefix' => 'sub-service'], function () {
    Route::get('/', [SubServiceManagerController::class, 'index']);
    Route::post('/', [SubServiceManagerController::class, 'store']);
    Route::put('/{id}', [SubServiceManagerController::class, 'update']);
    Route::delete('/{id}', [SubServiceManagerController::class, 'destroy']);
    Route::get('/{id}', [SubServiceManagerController::class, 'show']);
});
