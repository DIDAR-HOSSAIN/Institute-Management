<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentFee extends Model
{
    use HasFactory;

    protected $fillable = ['student_id', 'class_fee_id', 'paid_amount', 'payment_method', 'payment_history', 'payment_date'];

    protected $casts = [
        'months' => 'array',
        'payment_date' => 'date',
        'payment_history' => 'array'
    ];

    // Fee type (Admission, Tuition, Exam)
    public function fee()
    {
        return $this->belongsTo(Fee::class);
    }

    // Payment history
    public function payments()
    {
        return $this->hasMany(StudentFeePayment::class);
    }

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function classFee()
    {
        return $this->belongsTo(ClassFee::class);
    }

}
