<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('directories', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('hospital_id');
            $table->foreign('hospital_id')->references('id')->on('hospitals')->onDelete('cascade');

            $table->unsignedBigInteger('unit_id')->nullable();
            $table->foreign('unit_id')->references('id')->on('units')->onDelete('set null');

            $table->string('name');
            $table->string('phone_number');
            $table->text('description')->nullable();

            $table->unsignedBigInteger('created_by_user_id')->nullable();
            $table->foreign('created_by_user_id')->references('id')->on('users')->onDelete('set null');

            $table->unsignedBigInteger('last_edited_by_user_id')->nullable();
            $table->foreign('last_edited_by_user_id')->references('id')->on('users')->onDelete('set null');

            $table->softDeletes();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('directories');
    }
};