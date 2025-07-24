<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Profession\ProfessionManagerController;

Route::group(['prefix' => 'profession'], function () {
    Route::get('/', [ProfessionManagerController::class, 'index']);
    Route::get('/categories', [ProfessionManagerController::class, 'getCategoriesProfessions']);
});
