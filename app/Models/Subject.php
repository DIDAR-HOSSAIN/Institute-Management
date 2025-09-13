<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subject extends Model
{
    use HasFactory;

    protected $fillable = ['school_class_id', 'subject_name', 'subject_code', 'full_mark', 'pass_mark'];

    public function schoolClass()
    {
        return $this->belongsTo(SchoolClass::class);
    }

    public function results()
    {
        return $this->hasMany(Result::class);
    }
}
