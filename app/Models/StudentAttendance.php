<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentAttendance extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'class_schedule_id',
        'device_user_id',
        'date',
        'in_time',
        'out_time',
        'status',
        'device_ip',
        'source',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function classSchedule()
    {
        return $this->belongsTo(ClassSchedule::class, 'class_schedule_id');
    }

    // Leave relationship (simple, without date filter)
    public function leave()
    {
        return $this->hasMany(Leave::class, 'student_id', 'student_id');
    }

    // Check if attendance is on leave
    public function isOnLeave()
    {
        return $this->leave()
            ->whereDate('start_date', '<=', $this->date)
            ->whereDate('end_date', '>=', $this->date)
            ->exists();
    }

    // Check if attendance is on holiday
    public function isHoliday()
    {
        return Holiday::whereDate('date', $this->date)->exists();
    }

    // Status calculation
    public function getStatusAttribute()
    {
        if ($this->isHoliday()) return 'Holiday';
        if ($this->isOnLeave()) return 'Leave';
        if (!$this->in_time) return 'Absent';
        if ($this->in_time > optional($this->classSchedule)->start_time) return 'Late';
        return 'Present';
    }
}
