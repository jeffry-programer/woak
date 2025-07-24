<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CategoryProfession extends Model
{
    protected $table = 'categories_professions';
    protected $fillable = [
        'title',
    ];

    public function professions()
    {
        return $this->hasMany(Profession::class);
    }
}
