<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentFeePayment extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_fee_id',
        'type',
        'month',
        'paid_amount',
        'payment_date',
        'payment_method',
    ];

    public function studentFee()
    {
        return $this->belongsTo(StudentFee::class);
    }

}
