<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Leave extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'school_class_id',
        'section_id',
        'leave_type',
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

    // 🔹 Class relation
    public function schoolClass()
    {
        return $this->belongsTo(SchoolClass::class, 'school_class_id');
    }

    // 🔹 Section relation
    public function section()
    {
        return $this->belongsTo(Section::class, 'section_id');
    }

}
