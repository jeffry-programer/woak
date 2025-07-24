<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SubService extends Model
{
    use SoftDeletes;

    protected $table = 'sub_services';

    protected $fillable = [
        'sub_service_name',
        'status',
        'sub_service_image',
        'service_id'
    ];

    public function service()
    {
        return $this->belongsTo(Service::class, 'service_id', 'id');
    }
}