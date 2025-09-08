<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Fee extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'amount', 'type'];

    public function studentFees()
    {
        return $this->hasMany(StudentFee::class);
    }

    public function classFees()
    {
        return $this->hasMany(ClassFee::class);
    }
}
