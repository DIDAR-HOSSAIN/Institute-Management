<?php

namespace App\Http\Controllers;

use App\Models\StudentAttendance;
use App\Http\Requests\StoreStudentAttendanceRequest;
use App\Http\Requests\UpdateStudentAttendanceRequest;
use App\Models\ClassSchedule;
use App\Models\SchoolClass;
use App\Models\Section;
use App\Models\Student;
use App\Models\Holiday;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use MehediJaman\LaravelZkteco\LaravelZkteco;

class StudentAttendanceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $filters = $request->only([
            'school_class_id',
            'section_id',
            'schedule_id',
            'start_date',
            'end_date'
        ]);

        $query = StudentAttendance::with(['student.schoolClass', 'student.section', 'classSchedule', 'leave']);

        if (!empty($filters['start_date'])) {
            $query->whereDate('date', '>=', $filters['start_date']);
        }
        if (!empty($filters['end_date'])) {
            $query->whereDate('date', '<=', $filters['end_date']);
        }

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

        $attendances = $query->orderBy('date', 'desc')->paginate(20)->withQueryString();

        $attendances->getCollection()->transform(function ($attendance) {

            // আজকের জন্য প্রযোজ্য leave
            $leave_for_today = $attendance->leave()
                ->whereDate('start_date', '<=', $attendance->date)
                ->whereDate('end_date', '>=', $attendance->date)
                ->first();

            $leave_status = $leave_for_today->status ?? null;

            // আজকের জন্য প্রযোজ্য holiday
            $holiday_for_today = Holiday::whereDate('date', $attendance->date)->first();
            $is_holiday = $holiday_for_today ? true : false;

            // Early Leave check
            $is_early_leave = false;
            if ($attendance->out_time && $attendance->classSchedule?->end_time) {
                $outTime = \Carbon\Carbon::parse($attendance->out_time);
                $endTime = \Carbon\Carbon::parse($attendance->classSchedule->end_time);

                if ($outTime->lt($endTime)) {
                    $is_early_leave = true;
                }
            }

            // চূড়ান্ত Status নির্ধারণ
            if ($is_holiday) {
                $attendance->final_status = 'Holiday';
            } elseif ($leave_status === 'Approved') {
                $attendance->final_status = 'Leave';
            } elseif (in_array($leave_status, ['Pending', 'Rejected'])) {
                $attendance->final_status = 'Absent';
            } elseif ($is_early_leave) {
                $attendance->final_status = 'Early Leave';
            } else {
                $attendance->final_status = $attendance->status; // Present, Late, etc.
            }

            // Flags for frontend
            $attendance->holiday = $is_holiday;
            $attendance->is_on_leave = $leave_status === 'Approved';
            $attendance->is_late = $attendance->status === 'Late';
            $attendance->is_early_leave = $is_early_leave;

            return $attendance;
        });




        // Summary (final_status দিয়ে গণনা)
        $summary = [
            'Present'     => $attendances->getCollection()->where('final_status', 'Present')->count(),
            'Absent'      => $attendances->getCollection()->where('final_status', 'Absent')->count(),
            'Late'        => $attendances->getCollection()->where('final_status', 'Late')->count(),
            'Leave'       => $attendances->getCollection()->where('final_status', 'Leave')->count(),
            'Holiday'     => $attendances->getCollection()->where('final_status', 'Holiday')->count(),
            'Early Leave' => $attendances->getCollection()->where('final_status', 'Early Leave')->count(),
        ];


        return Inertia::render('Institute-Managements/Student-Attendance/ViewStudentAttendance', [
            'attendances' => $attendances,
            'classes'   => SchoolClass::all(['id', 'class_name']),
            'sections'  => Section::all(['id', 'section_name']),
            'schedules' => ClassSchedule::all(['id', 'schedule_name', 'start_time']),
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

        $today = now()->toDateString();
        $students = Student::all();

        foreach ($students as $student) {
            // ওই student's জন্য schedule
            $schedule = ClassSchedule::where('school_class_id', $student->school_class_id)
                ->where('section_id', $student->section_id)
                ->first();

            // 🔹 Holiday হলে শুধু row create হবে
            if (Holiday::whereDate('date', $today)->exists()) {
                StudentAttendance::updateOrCreate(
                    ['student_id' => $student->id, 'date' => $today],
                    [
                        'class_schedule_id' => $schedule?->id,
                        'in_time'           => null,
                        'out_time'          => null,
                        'device_user_id'    => $student->device_user_id,
                        'device_ip'         => $deviceIp,
                        'source'            => 'device',
                    ]
                );
                continue;
            }

            // ওই student এর সব ডিভাইস রেকর্ড (আজকের তারিখের)
            $deviceRecords = collect($data)
                ->where('id', (string) $student->device_user_id)
                ->filter(fn($rec) => date('Y-m-d', strtotime($rec['timestamp'])) == $today)
                ->sortBy('timestamp');

            if ($deviceRecords->isNotEmpty()) {
                // প্রথম ফিঙ্গার → in_time
                $firstRecord = $deviceRecords->first();
                $firstTime = date('H:i:s', strtotime($firstRecord['timestamp']));

                // শেষ ফিঙ্গার → out_time
                $lastRecord = $deviceRecords->last();
                $lastTime = date('H:i:s', strtotime($lastRecord['timestamp']));

                StudentAttendance::updateOrCreate(
                    ['student_id' => $student->id, 'date' => $today],
                    [
                        'class_schedule_id' => $schedule?->id,
                        'device_user_id'    => $student->device_user_id,
                        'device_ip'         => $deviceIp,
                        'in_time'           => $firstTime,
                        'out_time'          => $lastTime,
                        'source'            => 'device',
                    ]
                );
            } else {
                // Absent → শুধু row create হবে কিন্তু in/out null
                StudentAttendance::updateOrCreate(
                    ['student_id' => $student->id, 'date' => $today],
                    [
                        'class_schedule_id' => $schedule?->id,
                        'device_user_id'    => $student->device_user_id,
                        'device_ip'         => $deviceIp,
                        'in_time'           => null,
                        'out_time'          => null,
                        'source'            => 'device',
                    ]
                );
            }
        }

        $zk->disconnect();
        return back()->with('success', 'Attendance synced successfully!');
    }
}
