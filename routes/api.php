<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

Route::post('/login', [App\Http\Controllers\Auth\AuthController::class, 'login']);

Route::group(['middleware' => 'auth:sanctum'], function () {
    require __DIR__ . '/entity/hospital.php';
    require __DIR__ . '/entity/unit.php';
    require __DIR__ . '/entity/service.php';
    require __DIR__ . '/entity/profession.php';
    require __DIR__ . '/entity/hospitalUser.php';
    require __DIR__ . '/entity/user.php';
    require __DIR__ . '/entity/directory.php';
    require __DIR__ . '/entity/subservice.php';
    require __DIR__ . '/entity/support.php';

    Route::post('/logout', [App\Http\Controllers\Auth\AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});
