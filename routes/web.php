<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/login', function () {
    return Inertia::render('auth/Login');
})->name('login');

Route::post('/login', [App\Http\Controllers\Auth\AuthenticatedSessionController::class, 'store'])->name('act.login');

Route::post('/logout', [App\Http\Controllers\Auth\AuthenticatedSessionController::class, 'destroy'])->name('logout');


Route::group(['prefix' => 'act', 'middleware' => 'auth'], function () {
    require __DIR__ . '/entity/hospital.php';
    require __DIR__ . '/entity/unit.php';
    require __DIR__ . '/entity/service.php';
    require __DIR__ . '/entity/subservice.php';
    require __DIR__ . '/entity/profession.php';
    require __DIR__ . '/entity/hospitalUser.php';
    require __DIR__ . '/entity/user.php';
    require __DIR__ . '/entity/directory.php';
    require __DIR__ . '/entity/support.php';
});


require __DIR__ . '/admin/web.php';
