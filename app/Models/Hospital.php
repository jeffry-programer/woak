<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\File;

class Hospital extends Model
{
    use SoftDeletes;

    protected $table = 'hospitals';

    protected $fillable = [
        'hospital_code',
        'hospital_name',
        'description',
        'general_details',
        'location',
        'latitude',
        'longitude',
        'status'
    ];

    protected $with = ['image'];

    protected $casts = [
        'status' => 'boolean',
    ];

    public function hospitalUsers()
    {
        return $this->hasMany(HospitalUser::class, 'hospital_id', 'id');
    }

    public function supports()
    {
        return $this->hasMany(Support::class, 'hospital_id', 'id');
    }

    public function image()
    {
        return $this->morphOne(File::class, 'entity');
    }
}
