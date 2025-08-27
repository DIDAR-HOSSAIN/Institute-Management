<?php

namespace App\Http\Controllers;

use App\Models\StudentAttendance;
use App\Http\Requests\StoreStudentAttendanceRequest;
use App\Http\Requests\UpdateStudentAttendanceRequest;
use App\Models\ClassSchedule;
use App\Models\SchoolClass;
use App\Models\Section;
use App\Models\Student;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class StudentAttendanceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Filters
        $filters = $request->only([
            'school_class_id',
            'section_id',
            'schedule_id',
            'start_date',
            'end_date'
        ]);

        // Base query with relationships
        $query = StudentAttendance::with([
            'student.schoolClass',
            'student.section',
            'classSchedule'
        ]);

        // Apply filters
        if (!empty($filters['school_class_id'])) {
            $query->whereHas('student', function ($q) use ($filters) {
                $q->where('school_class_id', $filters['school_class_id']);
            });
        }

        if (!empty($filters['section_id'])) {
            $query->whereHas('student', function ($q) use ($filters) {
                $q->where('section_id', $filters['section_id']);
            });
        }

        if (!empty($filters['schedule_id'])) {
            $query->where('class_schedule_id', $filters['schedule_id']);
        }

        if (!empty($filters['start_date'])) {
            $query->whereDate('date', '>=', $filters['start_date']);
        }

        if (!empty($filters['end_date'])) {
            $query->whereDate('date', '<=', $filters['end_date']);
        }

        // Get paginated attendances
        $attendances = $query->orderBy('date', 'desc')->paginate(20)->withQueryString();

        // Summary counts
        $summary = [
            'Present' => (clone $query)->where('status', 'Present')->count(),
            'Absent' => (clone $query)->where('status', 'Absent')->count(),
            'Late' => (clone $query)->where('status', 'Late')->count(),
            'Leave' => (clone $query)->where('status', 'Leave')->count(),
            'Holiday' => (clone $query)->where('status', 'Holiday')->count(),
        ];

        return Inertia::render('Institute-Managements/Student-Attendance/ViewStudentAttendance', [
            'attendances' => $attendances,
            'classes' => SchoolClass::all(['id', 'class_name']),
            'sections' => Section::all(['id', 'section_name']),
            'schedules' => ClassSchedule::all(['id', 'schedule_name']),
            'filters' => $filters,
            'summary' => $summary,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // eager load sections and students under sections for dynamic UI; if huge dataset, switch to lazy API.
        $classes = SchoolClass::with(['sections.students'])->get();
        return Inertia::render('Institute-Managements/Student-Attendance/CreateStudentAttendance', compact('classes'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreStudentAttendanceRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(StudentAttendance $studentAttendance)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(StudentAttendance $studentAttendance)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateStudentAttendanceRequest $request, StudentAttendance $studentAttendance)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(StudentAttendance $studentAttendance)
    {
        $studentAttendance->delete();
        return redirect()->route('attendance.index')->with('success', 'Deleted');
    }


    public function syncCreate()
    {
        return Inertia::render('Payroll/DataPull'); // তোমার React পেজ অনুযায়ী নাম দাও
    }


    public function sync()
    {
        $zk = new \MehediJaman\LaravelZkteco\LaravelZkteco('192.168.1.40');
        $machineId = '192.168.1.40';

        // Step 1: Device connection test
        if (!$zk->connect()) {
            echo "❌ Unable to connect to device at {$machineId}\n";
            return;
        }
        echo "✅ Connected to device: {$machineId}\n";

        // Step 2: Pull attendance data from device
        $data = $zk->getAttendance();

        if (empty($data)) {
            echo "⚠ No attendance data found from device.\n";
            return;
        }

        echo "📥 Total records pulled: " . count($data) . "\n";

        // Step 3: Process each entry
        foreach ($data as $entry) {
            echo "➡ Processing User ID: {$entry['id']} | Time: {$entry['timestamp']}\n";

            $date = date('Y-m-d', strtotime($entry['timestamp']));
            $time = date('H:i:s', strtotime($entry['timestamp']));

            // Skip Friday
            if (date('l', strtotime($date)) === 'Friday') {
                echo "⏩ Skipped (Friday)\n";
                continue;
            }

            // Skip holiday
            if (\App\Models\Holiday::where('date', $date)->exists()) {
                echo "⏩ Skipped (Holiday)\n";
                continue;
            }

            // Check existing attendance
            $attendance = \App\Models\StudentAttendance::where('user_id', $entry['id'])
                ->where('date', $date)
                ->first();

            if (!$attendance) {
                \App\Models\StudentAttendance::create([
                    'device_ip'         => $machineId,
                    'user_id'           => $entry['id'],
                    'class_schedule_id' => null,
                    'date'              => $date,
                    'in_time'           => $time,
                    'out_time'          => $time,
                    'status'            => 'Present',
                    'source'            => 'device',
                ]);
                echo "✅ New attendance saved for user {$entry['id']} on {$date}\n";
            } else {
                if ($attendance->in_time === null || strtotime($time) < strtotime($attendance->in_time)) {
                    $attendance->in_time = $time;
                }
                if ($attendance->out_time === null || strtotime($time) > strtotime($attendance->out_time)) {
                    $attendance->out_time = $time;
                }
                $attendance->device_ip = $machineId;
                $attendance->save();

                echo "🔄 Attendance updated for user {$entry['id']} on {$date}\n";
            }
        }

        $zk->disconnect();
        echo "🎉 Attendance sync completed.\n";
    }

}
