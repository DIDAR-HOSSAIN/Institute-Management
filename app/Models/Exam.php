<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Exam extends Model
{
    use HasFactory;

    protected $fillable = ['exam_name', 'school_class_id', 'exam_year', 'exam_term', 'start_date', 'end_date'];

    public function schoolClass()
    {
        return $this->belongsTo(SchoolClass::class);
    }

    public function results()
    {
        return $this->hasMany(Result::class);
    }

}
