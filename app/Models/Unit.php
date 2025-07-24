<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Unit extends Model
{
    use SoftDeletes;

    protected $table = 'units';

    protected $with = ['image'];

    protected $fillable = [
        'hospital_id',
        'unit_name',
        'status',
        'unit_image'
    ];

    public function hospital()
    {
        return $this->belongsTo(Hospital::class, 'hospital_id', 'id');
    }

    public function hospitalUser()
    {
        return $this->hasMany(HospitalUser::class);
    }

    public function image()
    {
        return $this->morphOne(File::class, 'entity');
    }

    public function services()
    {
        return $this->belongsToMany(Service::class, 'units_services', 'unit_id', 'service_id');
    }
}
