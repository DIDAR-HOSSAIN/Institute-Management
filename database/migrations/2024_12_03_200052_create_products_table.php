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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('product_id')->nullable()->unique();
            $table->unsignedBigInteger('category_id')->nullable();
            $table->string('product_name')->nullable(false);
            $table->string('category_name')->nullable(false);
            $table->string('sku')->nullable();
            $table->date('purchase_date');
            $table->string('supplier_name')->nullable();
            $table->string('slug')->nullable();
            $table->text('description')->nullable(false);
            $table->string('image1')->nullable(false);
            $table->string('image2')->nullable();
            $table->string('image3')->nullable();
            $table->string('image4')->nullable();
            $table->string('image5')->nullable();
            $table->integer('stock_in')->nullable();
            $table->integer('stock_out')->nullable();
            $table->float('purchase_price')->nullable(false);
            $table->float('sales_price')->nullable(false);
            $table->float('previous_price')->nullable();
            $table->float('profit')->nullable();
            $table->string('user_name');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
