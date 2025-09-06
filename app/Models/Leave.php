<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Leave extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'start_date',
        'end_date',
        'reason',
        'status',
    ];

    // 🔹 Student relation
    public function student()
    {
        return $this->belongsTo(Student::class);
    }

}
