<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Support\SupportManagerController;

Route::group(['prefix' => 'support'], function () {
    Route::get('/', [SupportManagerController::class, 'index']);
    Route::post('/', [SupportManagerController::class, 'store']);
    Route::put('/{id}', [SupportManagerController::class, 'update']);
    Route::delete('/{id}', [SupportManagerController::class, 'destroy']);
    Route::get('/{id}', [SupportManagerController::class, 'show']);
});
