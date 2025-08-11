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
        Schema::create('hot_items', function (Blueprint $table) {
            $table->id();
            $table->string('item_name')->nullable(false);
            $table->string('image')->nullable(false);
            $table->string('description')->nullable();
            $table->boolean('status')->default(1);
            $table->string('user_name');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hot_items');
    }
};
