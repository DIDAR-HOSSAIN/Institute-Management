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
        Schema::create('general_members', function (Blueprint $table) {
            $table->id();
            $table->string('member_id');
            $table->string('name', 55);
            $table->string('father_name', 55);
            $table->string('mother_name', 55);
            $table->string('image')->nullable();
            $table->date('date_of_birth');
            $table->string('gender', 10);
            $table->string('mobile_no', 15);
            $table->string('nid_no', 17)->nullable();
            $table->string('email', 55)->nullable();
            $table->string('blood_group', 3)->nullable();
            $table->string('occupation', 55)->nullable();
            $table->date('reg_date')->nullable();
            $table->date('approval_date')->nullable();
            $table->year('dakhil_year')->nullable();
            $table->year('alim_year')->nullable();
            $table->year('fazil_year')->nullable();
            $table->string('district')->nullable();
            $table->string('upazila')->nullable();
            $table->string('union_or_pourshava', 55)->nullable();
            $table->string('post_office', 55)->nullable();
            $table->unsignedTinyInteger('ward_no')->nullable(); // Removed auto_increment and primary key
            $table->string('house_no_or_name', 100)->nullable();
            $table->text('present_address')->nullable();
            $table->decimal('membership_fee', 8, 2);
            $table->string('transaction_no', 12)->nullable();
            $table->enum('status', ['Pending', 'Approved']);
            $table->string('user_name', 55)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('general_members');
    }
};
