<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'employee_id', 'roster_id'];

    public function attendance()
    {
        return $this->hasMany(Attendance::class);
    }

    public function roster()
    {
        return $this->belongsTo(Roster::class);
    }
}
