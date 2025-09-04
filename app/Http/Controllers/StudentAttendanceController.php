<?php

namespace App\Http\Controllers;

use App\Models\StudentAttendance;
use App\Http\Requests\StoreStudentAttendanceRequest;
use App\Http\Requests\UpdateStudentAttendanceRequest;
use App\Models\ClassSchedule;
use App\Models\SchoolClass;
use App\Models\Section;
use Illuminate\Http\Request;
use Inertia\Inertia;
use MehediJaman\LaravelZkteco\LaravelZkteco;

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

    // Date filters on StudentAttendance table
    if (!empty($filters['start_date'])) {
        $query->whereDate('date', '>=', $filters['start_date']);
    }
    if (!empty($filters['end_date'])) {
        $query->whereDate('date', '<=', $filters['end_date']);
    }

    // Apply filters (student/class/section/schedule level)
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

    // Get paginated attendances
    $attendances = $query->orderBy('date', 'desc')->paginate(20)->withQueryString();

    // Summary counts
    $summary = [
        'Present' => (clone $query)->where('status', 'Present')->count(),
        'Absent'  => (clone $query)->where('status', 'Absent')->count(),
        'Late'    => (clone $query)->where('status', 'Late')->count(),
        'Leave'   => (clone $query)->where('status', 'Leave')->count(),
        'Holiday' => (clone $query)->where('status', 'Holiday')->count(),
    ];

    return Inertia::render('Institute-Managements/Student-Attendance/ViewStudentAttendance', [
        'attendances' => $attendances,

        'classes'   => SchoolClass::all(['id as id', 'class_name as name']),
        'sections'  => Section::all(['id as id', 'section_name as name']),
        'schedules' => ClassSchedule::all(['id as id', 'schedule_name as name']),

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
        $deviceIp = '192.168.1.40';
        $zk = new \MehediJaman\LaravelZkteco\LaravelZkteco($deviceIp);

        if (!$zk->connect()) {
            return back()->with('error', 'Unable to connect to device.');
        }

        $data = $zk->getAttendance();

        if (empty($data)) {
            return back()->with('error', 'No attendance data found on device.');
        }

        foreach ($data as $entry) {
            $machineUserId = $entry['id'] ?? $entry['uid'] ?? null;
            if (!$machineUserId) continue;

            $timestamp = strtotime($entry['timestamp']);
            $date      = date('Y-m-d', $timestamp);
            $time      = date('H:i:s', $timestamp);

            // Student খুঁজে পাওয়া (আগেই ভর্তি করা থাকবে)
            $student = \App\Models\Student::where('device_user_id', $machineUserId)->first();
            // dd($student);

            if (!$student) {
                // যদি মেশিনের user_id এর সাথে কোনো student না মেলে → skip
                continue;
            }

            // $schedule = \App\Models\ClassSchedule::where('class_schedule_id')->first();

            // StudentAttendance খুঁজে নেওয়া বা নতুন তৈরি
            $attendance = \App\Models\StudentAttendance::where('device_user_id', $machineUserId)
                ->where('date', $date)
                ->first();

            if (!$attendance) {
                // নতুন attendance এন্ট্রি
                \App\Models\StudentAttendance::create([
                    'student_id'     => $student->id,
                    // 'class_schedule_id'     => $schedule->id,
                    'device_user_id' => $machineUserId,
                    'device_ip'      => $deviceIp,
                    'date'           => $date,
                    'in_time'        => $time,
                    'out_time'       => $time,
                    'status'         => 'Present',
                    'source'         => 'device',
                ]);
            } else {
                // আগের in/out time update করা
                $updated = false;

                if (strtotime($time) < strtotime($attendance->in_time)) {
                    $attendance->in_time = $time;
                    $updated = true;
                }
                if (strtotime($time) > strtotime($attendance->out_time)) {
                    $attendance->out_time = $time;
                    $updated = true;
                }

                if ($updated) {
                    $attendance->save();
                }
            }
        }

        $zk->disconnect();
        return back()->with('success', 'Attendance synced successfully!');
    }






    // public function sync()
    // {
    //     $deviceIp = '192.168.1.40';
    //     $zk = new \MehediJaman\LaravelZkteco\LaravelZkteco($deviceIp);

    //     if (!$zk->connect()) {
    //         return back()->with('error', 'Unable to connect to device.');
    //     }

    //     $data = $zk->getAttendance();

    //     if (empty($data)) {
    //         return back()->with('error', 'No attendance data found on device.');
    //     }

    //     // Default class schedule
    //     $defaultClassSchedule = \App\Models\ClassSchedule::firstOrCreate(
    //         ['start_time' => '09:00:00', 'end_time' => '17:00:00'],
    //         ['school_class_id' => 1, 'section_id' => 1, 'schedule_name' => 'Default Schedule']
    //     );

    //     foreach ($data as $entry) {
    //         $machineUserId = $entry['id'] ?? $entry['uid'] ?? null;
    //         if (!$machineUserId) continue;

    //         $timestamp = strtotime($entry['timestamp']);
    //         $date      = date('Y-m-d', $timestamp);
    //         $time      = date('H:i:s', $timestamp);

    //         // Student খুঁজে পাওয়া বা নতুন তৈরি
    //         $student = \App\Models\Student::firstOrCreate(
    //             ['student_id' => $machineUserId],
    //             [
    //                 'name'              => 'Unknown ' . $machineUserId,
    //                 'class_schedule_id' => $defaultClassSchedule->id
    //             ]
    //         );

    //         // StudentAttendance খুঁজে নেওয়া বা নতুন তৈরি
    //         $attendance = \App\Models\StudentAttendance::where('student_id', $student->id)
    //             ->where('date', $date)
    //             ->first();

    //         if (!$attendance) {
    //             // নতুন এন্ট্রি
    //             \App\Models\StudentAttendance::create([
    //                 'student_id'        => $student->id,
    //                 'class_schedule_id' => $defaultClassSchedule->id,
    //                 'device_user_id'    => $machineUserId,   // মেশিন থেকে আসা User ID
    //                 'device_ip'         => $deviceIp,       // মেশিনের IP
    //                 'date'              => $date,
    //                 'in_time'           => $time,
    //                 'out_time'          => $time,
    //                 'status'            => 'Present',
    //                 'source'            => 'device',
    //             ]);
    //         } else {
    //             // আগের ইন/আউট টাইমের সাথে মিলিয়ে নতুন টাইম আপডেট
    //             $updated = false;

    //             if (strtotime($time) < strtotime($attendance->in_time)) {
    //                 $attendance->in_time = $time;
    //                 $updated = true;
    //             }
    //             if (strtotime($time) > strtotime($attendance->out_time)) {
    //                 $attendance->out_time = $time;
    //                 $updated = true;
    //             }

    //             if ($updated) {
    //                 $attendance->save();
    //             }
    //         }
    //     }

    //     $zk->disconnect();
    //     return back()->with('success', 'Attendance synced successfully without duplicates!');
    // }

}
