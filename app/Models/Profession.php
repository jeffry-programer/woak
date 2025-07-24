<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Profession extends Model
{
    protected $table = 'professions';
    protected $fillable = [
        'title',
    ];

    public function categoryProfession()
    {
        return $this->belongsTo(CategoryProfession::class);
    }

    public function hospitalUser()
    {
        return $this->hasMany(HospitalUser::class);
    }
}
