<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RequestHospital extends Model
{
    protected $table = 'request_hospital';

    protected $fillable = [
        'fullname',
        'email',
        'phone',
        'hospital_name',
        'status',
    ];
}
