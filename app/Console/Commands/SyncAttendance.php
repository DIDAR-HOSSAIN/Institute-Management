<?php

namespace App\Console\Commands;

use App\Http\Controllers\StudentAttendanceController;
use Illuminate\Console\Command;

class SyncAttendance extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    
    protected $signature = 'student-attendance:sync';
    protected $description = 'Sync student attendance from ZKTeco device';

    public function handle()
    {
        $controller = new StudentAttendanceController();
        $controller->sync();
        $this->info('🎓 Student attendance synced successfully.');
    }
}
