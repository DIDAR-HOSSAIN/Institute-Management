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
        Schema::create('student_attendances', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('student_id')->nullable();
            $table->unsignedBigInteger('class_schedule_id')->nullable();
            $table->integer('user_id')->nullable();
            $table->date('date');
            $table->time('in_time');
            $table->time('out_time');
            $table->enum('status', ['Present', 'Absent', 'Late', 'Holiday'])->default('Absent');
            $table->string('device_ip')->nullable();
            $table->string('source')->default('device');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_attendances');
    }
};
