<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentFee extends Model
{
    use HasFactory;

    protected $fillable = ['student_id', 'total_paid', 'last_payment_date'];

    protected $casts = [
        'months' => 'array',
    ];

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
