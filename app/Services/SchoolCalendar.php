<?php

namespace App\Services;

use App\Models\Holiday;
use Carbon\Carbon;

class SchoolCalendar
{
    public static function isClosed(Carbon|string $date): bool
    {
        $date = $date instanceof Carbon ? $date->copy()->startOfDay() : Carbon::parse($date)->startOfDay();

        // Weekly off চেক
        $weeklyOffs = config('school.weekly_offs', ['Friday']);
        if (in_array($date->englishDayOfWeek, $weeklyOffs, true)) {
            return true;
        }

        // Holiday টেবিল চেক
        return Holiday::whereDate('date', $date)->exists();
    }

    public static function closedReason(Carbon|string $date): ?string
    {
        $date = $date instanceof Carbon ? $date->copy()->startOfDay() : Carbon::parse($date)->startOfDay();
        $weeklyOffs = config('school.weekly_offs', ['Friday']);

        if (in_array($date->englishDayOfWeek, $weeklyOffs, true)) {
            return 'Weekly Off';
        }

        $holiday = Holiday::whereDate('date', $date)->first();
        return $holiday ? 'Holiday: ' . $holiday->title : null;
    }
}
