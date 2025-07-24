<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class File extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'size',
        'type',
        'path_local',
        'entity_id',
        'entity_type'
    ];

    public function entity()
    {
        return $this->morphTo();
    }
}
