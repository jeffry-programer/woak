<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Hospital;
use App\Models\Unit;  
use App\Models\User;

class Directory extends Model
{
    use SoftDeletes;

    protected $table = 'directories'; 

    protected $fillable = [
        'hospital_id',
        'unit_id',
        'name',           
        'phone_number',   
        'description',   
        'created_by_user_id',
        'last_edited_by_user_id',
    ];

    protected $with = ['hospital', 'unit', 'createdBy', 'editedBy'];

    public function hospital()
    {
        return $this->belongsTo(Hospital::class, 'hospital_id', 'id');
    }

    public function unit()
    {
        return $this->belongsTo(Unit::class, 'unit_id', 'id');
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by_user_id', 'id');
    }

    public function editedBy()
    {
        return $this->belongsTo(User::class, 'last_edited_by_user_id', 'id');
    }
}