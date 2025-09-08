<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentFee extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'fee_id',
        'paid_amount',
        'payment_method',
        'payment_date',
        'months'
    ];

    protected $casts = [
        'months' => 'array', // Auto cast JSON to array
    ];


    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function fee()
    {
        return $this->belongsTo(Fee::class);
    }
}
