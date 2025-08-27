<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'roll_number',
        'school_class_id',
        'section_id',
       ' machine_user_id',
        'student_name',
        'dob',
        'academic_year',
        'gender',
        'contact_no',
        'address'];

    public function schoolClass()
    {
        return $this->belongsTo(SchoolClass::class);
    }

    public function section()
    {
        return $this->belongsTo(Section::class);
    }

    public function attendances()
    {
        return $this->hasMany(StudentAttendance::class);
    }

    public function fees()
    {
        return $this->hasMany(StudentFee::class);
    }

    public function results()
    {
        return $this->hasMany(Result::class);
    }
}
