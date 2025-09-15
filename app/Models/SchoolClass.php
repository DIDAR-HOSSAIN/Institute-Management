<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SchoolClass extends Model
{
    use HasFactory;

    protected $fillable = ['class_name'];

    public function sections()
    {
        return $this->hasMany(Section::class);
    }

    public function schedules()
    {
        return $this->hasMany(ClassSchedule::class);
    }

    public function students()
    {
        return $this->hasMany(Student::class);
    }

    public function fees()
    {
        return $this->hasMany(ClassFee::class);
    }

    public function subjects()
    {
        return $this->belongsToMany(Subject::class, 'class_subjects')
            ->withTimestamps();
    }

}
