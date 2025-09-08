<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentFeePayment extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_fee_id',
        'paid_amount',
        'payment_method',
        'months',
        'payment_date',
    ];

    protected $casts = [
        'months' => 'array',
        'payment_date' => 'date',
    ];

    public function studentFee()
    {
        return $this->belongsTo(StudentFee::class);
    }
}
