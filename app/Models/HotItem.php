<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HotItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'item_name',
        'image',
        'description',
        'status',
        'user_name'
    ];
}
