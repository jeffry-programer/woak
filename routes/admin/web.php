<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


    Route::get('/', function () {
        return Inertia::render('Admin/Dashboard');
    })->middleware('auth');

    Route::get('/hospital/list', function () {
        return Inertia::render('Admin/Hospital/ListHospitals');
    })->middleware('auth');

    Route::get('/hospital/add', function () {
        return Inertia::render('Admin/Hospital/AddHospital');
    })->middleware('auth');
       
        
    Route::get('/hospital/details/{id}', function () {
        return Inertia::render('Admin/Hospital/HospitalDetails');
    })->middleware('auth');

    Route::get('/hospital/edit/{id}', function ($id) {
    return Inertia::render('Admin/Hospital/EditHospital', [
        'id' => $id
    ]);
    })->middleware('auth');

    Route::get('/user/list', function () {
        return Inertia::render('Admin/User/ListUser');
    })->middleware('auth');

    Route::get('/user/add', function () {
        return Inertia::render('Admin/User/AddUser');
    })->middleware('auth');

    Route::get('/user/edit/{id}', function ($id) {
        return Inertia::render('Admin/User/AddUser', [
            'id' => $id
        ]);
    })->middleware('auth');

    Route::get('/trash/list', function () {
        return Inertia::render('Admin/Trash/ListTrash');
    })->middleware('auth');

        