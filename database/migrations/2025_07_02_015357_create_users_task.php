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
        Schema::create('users_tasks', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('hospital_user_id');
            $table->unsignedBigInteger('task_id');
            $table->time('time_response');
            $table->boolean('is_canceled')->default(false);
            $table->text('comments')->nullable();
            $table->foreign('hospital_user_id')->references('id')->on('hospital_users')->onDelete('cascade');
            $table->foreign('task_id')->references('id')->on('tasks')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users_task');
    }
};
