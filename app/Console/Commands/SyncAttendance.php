<?php

namespace App\Console\Commands;

use App\Http\Controllers\AttendanceController;
use Illuminate\Console\Command;

class SyncAttendance extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'attendance:sync';
    protected $description = 'Sync attendance from ZKTeco device';

    public function handle()
    {
        $controller = new AttendanceController();
        $controller->sync();
        $this->info('Attendance synced successfully.');
    }
}
