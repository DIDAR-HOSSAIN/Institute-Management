<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    use HasFactory;

    protected $fillable = [
        'roll_number',
        'school_class_id',
        'section_id',
        'device_user_id',
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

    public function classSchedules()
    {
        return $this->hasMany(ClassSchedule::class, 'section_id', 'section_id')
            ->where('school_class_id', $this->school_class_id);
    }


    public function fees()
    {
        return $this->hasMany(StudentFee::class);
    }

    public function results()
    {
        return $this->hasMany(Result::class);
    }

    public function leaves()
    {
        return $this->hasMany(Leave::class);
    }

}
