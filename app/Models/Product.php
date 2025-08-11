<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\OrderItem;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'product_name',
        'category_id',
        'category_name',
        // 'sku',
        'purchase_date',
        'supplier_name',
        'description',
        // 'slug',
        'image1',
        'image2',
        'image3',
        'image4',
        'image5',
        'stock_in',
        'stock_out',
        'purchase_price',
        'sales_price',
        'previous_price',
        'profit',
        'user_name',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class, 'product_id', 'product_id');
    }
}
