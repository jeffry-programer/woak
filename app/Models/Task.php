<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    protected $table = 'tasks';
    protected $fillable = [
        'task_id',
        'room_number',
        'comments',
        'start_time',
        'end_time',
        'time_duration',
        'status',
        'date_start',
        'date_finished',
        'task_service_id',
        'hospital_user_id',
    ];

    public function taskService()
    {
        return $this->belongsTo(SubService::class, 'task_service_id');
    }

    public function hospitalUser()
    {
        return $this->belongsTo(HospitalUser::class, 'hospital_user_id');
    }
}
