<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClassSchedule extends Model
{
    use HasFactory;

    protected $fillable = [
        'school_class_id',
        'section_id',
        'schedule_name',
        'start_time',
        'end_time'
    ];

    public function schoolClass()
    {
        return $this->belongsTo(SchoolClass::class);
    }

    public function section()
    {
        return $this->belongsTo(Section::class);
    }

    public function students()
    {
        return $this->hasMany(Student::class);
    }
    
}
