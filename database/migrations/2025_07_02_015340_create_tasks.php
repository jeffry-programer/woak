<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->string('room_number', 10);
            $table->text('comments');
            $table->time('start_time');
            $table->time('end_time')->nullable();
            $table->float('time_duration')->nullable();
            $table->boolean('status');
            $table->date('date_start');
            $table->date('date_finished')->nullable();
            $table->foreignId('sub_service_id');
            $table->foreignId('hospital_user_id');
            $table->foreign('sub_service_id')->references('id')->on('sub_services')->onDelete('cascade');
            $table->foreign('hospital_user_id')->references('id')->on('hospital_users')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
