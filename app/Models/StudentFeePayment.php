<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentFeePayment extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_fee_id',
        'student_id',
        'fee_id',
        'payment_method',
        'month',
        'payment_date',
        'paid_amount',
    ];

    public function studentFee()
    {
        return $this->belongsTo(StudentFee::class);
    }
}
