<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClassFee extends Model
{
    use HasFactory;

    protected $fillable = ['class_id', 'fee_id', 'amount'];

    public function schoolClass()
    {
        return $this->belongsTo(SchoolClass::class);
    }

    public function studentFees()
    {
        return $this->hasMany(StudentFee::class);
    }

    public function fee()
    {
        return $this->belongsTo(Fee::class);
    }
}
