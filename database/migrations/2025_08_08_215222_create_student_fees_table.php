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
        Schema::create('student_fees', function (Blueprint $table) {
            $table->id();
            $table->string('student_id');
            $table->string('class_fee_id');
            $table->decimal('total_paid', 10, 2)->default(0);
            $table->enum('payment_method', ['Cash', 'Bkash', 'Bank']);
            $table->json('months')->nullable();
            $table->date('last_payment_date');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_fees');
    }
};
