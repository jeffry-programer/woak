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
        Schema::create('favorite_services', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('hospital_user_id');
            $table->unsignedBigInteger('service_id');
            $table->foreign('hospital_user_id')->references('id')->on('hospital_users')->onDelete('cascade');
            $table->foreign('service_id')->references('id')->on('services')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('favorite_services');
    }
};
