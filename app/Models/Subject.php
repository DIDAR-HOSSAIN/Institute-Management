<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subject extends Model
{
    use HasFactory;

    protected $fillable = ['subject_name', 'subject_code', 'full_mark', 'pass_mark'];

    public function classSubjects()
    {
        return $this->hasMany(ClassSubject::class);
    }

    public function schoolClass()
    {
        return $this->belongsTo(SchoolClass::class);
    }

    public function schoolClasses()
    {
        return $this->belongsToMany(SchoolClass::class, 'class_subjects')
            ->withTimestamps();
    }

    public function results()
    {
        return $this->hasMany(Result::class);
    }
}
