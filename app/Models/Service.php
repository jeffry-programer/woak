<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Service extends Model
{
    use SoftDeletes;

    protected $table = 'services';

    protected $fillable = [
        'hospital_id',
        'service_name',
        'status',
        'order',
        'service_image'
    ];

    protected $with = ['image'];

    public function hospital()
    {
        return $this->belongsTo(Hospital::class, 'hospital_id', 'id');
    }

    public function subServices()
    {
        return $this->hasMany(SubService::class, 'service_id', 'id');
    }

    public function image()
    {
        return $this->morphOne(File::class, 'entity');
    }

    public function units()
    {
        return $this->belongsToMany(Unit::class, 'units_services', 'service_id', 'unit_id');
    }
}
