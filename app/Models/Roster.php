<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Roster extends Model
{
    use HasFactory;

    protected $fillable = ['office_start', 'office_end'];

    public function employees()
    {
        return $this->hasMany(Employee::class);
    }

}
