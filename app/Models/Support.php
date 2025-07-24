<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Support extends Model
{
    protected $table = 'supports';

    protected $fillable = [
        'hospital_id',
        'hospital_data',
        'phone_number',
        'subject',
        'problem',
        'status',
    ];

    public function hospital()
    {
        return $this->belongsTo(Hospital::class, 'hospital_id', 'id');
    }

}