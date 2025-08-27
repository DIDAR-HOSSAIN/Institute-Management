<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Section extends Model
{
    use HasFactory;

    protected $fillable = ['school_class_id', 'section_name'];

    public function schoolClass()
    {
        return $this->belongsTo(SchoolClass::class);
    }

    public function students()
    {
        return $this->hasMany(Student::class);
    }

}
