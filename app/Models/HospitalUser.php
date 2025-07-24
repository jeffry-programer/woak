<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class HospitalUser extends Model
{
    use SoftDeletes;

    protected $table = 'hospital_users';
    protected $fillable = [
        'status',
        'type_user',
        'hospital_id',
        'user_id',
        'profession_id',
        'unit_id',
    ];

    protected $with = ['user', 'profession', 'unit'];

    public function hospital()
    {
        return $this->belongsTo(Hospital::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function profession()
    {
        return $this->belongsTo(Profession::class);
    }

    public function unit()
    {
        return $this->belongsTo(Unit::class);
    }
}
