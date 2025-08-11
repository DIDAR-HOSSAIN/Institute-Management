<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Http\Requests\StoreAttendanceRequest;
use App\Http\Requests\UpdateAttendanceRequest;
use App\Models\Employee;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use MehediJaman\LaravelZkteco\LaravelZkteco;

class AttendanceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // return inertia('AttendanceReport');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $employees = Employee::all();

        return Inertia::render('Payroll/ManualAttendance', [
            'employees' => $employees,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreAttendanceRequest $request)
    {
        $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'date' => 'required|date',
            'in_time' => 'required|date_format:H:i',
            'out_time' => 'required|date_format:H:i|after_or_equal:in_time',
        ]);

        $status = $request->in_time === $request->out_time ? 'Absent' : 'Present';

        Attendance::updateOrCreate([
            'employee_id' => $request->employee_id,
            'date' => $request->date,
        ], [
            'in_time' => $request->in_time,
            'out_time' => $request->out_time,
            'source' => 'manual',
            'status' => $status,
        ]);

        return redirect()->route('attendance.index')->with('success', 'Manual attendance saved.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Attendance $attendance)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Attendance $attendance)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAttendanceRequest $request, Attendance $attendance)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Attendance $attendance)
    {
        //
    }

    public function syncCreate()
    {
        return Inertia::render('Payroll/DataPull');
    }

    public function sync()
    {
        $zk = new \MehediJaman\LaravelZkteco\LaravelZkteco('192.168.1.40');

        if (!$zk->connect()) {
            return back()->with('error', 'Unable to connect to device.');
        }

        $data = $zk->getAttendance();

        // Ensure a default roster exists
        $defaultRoster = \App\Models\Roster::firstOrCreate(
            ['office_start' => '09:00:00', 'office_end' => '17:00:00']
        );

        foreach ($data as $entry) {
            // 1. Find or create employee
            $employee = \App\Models\Employee::firstOrCreate(
                ['employee_id' => $entry['id']],
                [
                    'name' => 'Unknown ' . $entry['id'], // Default name if unknown
                    'roster_id' => $defaultRoster->id
                ]
            );

            // 2. Parse time and date
            $date = date('Y-m-d', strtotime($entry['timestamp']));
            $time = date('H:i:s', strtotime($entry['timestamp']));

            // 3. Find existing attendance for the day
            $attendance = \App\Models\Attendance::where('employee_id', $employee->id)
                ->where('date', $date)
                ->first();

            if (!$attendance) {
                \App\Models\Attendance::create([
                    'employee_id' => $employee->id,
                    'date' => $date,
                    'in_time' => $time,
                    'out_time' => $time,
                    'status' => 'Present',
                    'source' => 'device',
                ]);
            } else {
                if (strtotime($time) < strtotime($attendance->in_time)) {
                    $attendance->in_time = $time;
                }
                if (strtotime($time) > strtotime($attendance->out_time)) {
                    $attendance->out_time = $time;
                }
                $attendance->save();
            }
        }

        $zk->disconnect();
        return back()->with('success', 'Attendance synced and employees/roster created dynamically.');
    }




    public function report(Request $request)
    {
        $filterDate = $request->date ?? now()->toDateString();

        // Step 1: Fetch all employees
        $allEmployees = Employee::with('roster')->get();

        // Step 2: Fetch attendances only for the selected date
        $attendances = Attendance::where('date', $filterDate)->get()->keyBy('employee_id');

        // Step 3: Build report for all employees
        $report = $allEmployees->map(function ($employee) use ($attendances, $filterDate) {
            $attendance = $attendances->get($employee->id);

            $rosterStart = $employee?->roster?->office_start ?? '09:00:00';
            $rosterEnd = $employee?->roster?->office_end ?? '17:00:00';

            if (!$attendance) {
                return [
                    'employee_id' => $employee->id,
                    'name' => $employee->name,
                    'date' => $filterDate,
                    'in_time' => null,
                    'out_time' => null,
                    'status' => 'Absent',
                    'source' => null,
                ];
            }

            // If attendance is found, calculate status
            $inTime = Carbon::parse($attendance->in_time);
            $outTime = Carbon::parse($attendance->out_time);
            $rosterStartTime = Carbon::parse($rosterStart);
            $rosterEndTime = Carbon::parse($rosterEnd);

            if ($inTime->eq($outTime)) {
                $status = 'Absent';
            } elseif ($inTime->gt($rosterStartTime)) {
                $status = 'Late';
            } elseif ($outTime->lt($rosterEndTime)) {
                $status = 'Left Early';
            } else {
                $status = 'Present';
            }

            return [
                'employee_id' => $employee->id,
                'name' => $employee->name,
                'date' => $attendance->date,
                'in_time' => $attendance->in_time,
                'out_time' => $attendance->out_time,
                'status' => $status,
                'source' => $attendance->source,
            ];
        });

        return Inertia::render('Payroll/PayrollReport', [
            'reportData' => $report,
        ]);
    }



    // public function report(Request $request)
    // {
    //     $filterDate = $request->date ?? now()->toDateString();

    //     $attendances = Attendance::with(['employee', 'employee.roster'])
    //         ->where('date', $filterDate)
    //         ->get();

    //     $report = $attendances->map(function ($att) {
    //         $employee = $att->employee;

    //         $rosterStart = $employee?->roster?->office_start ?? '09:00:00';
    //         $rosterEnd = $employee?->roster?->office_end ?? '17:00:00';

    //         $status = $att->status;

    //         $inTime = Carbon::parse($att->in_time);
    //         $outTime = Carbon::parse($att->out_time);
    //         $rosterStartTime = Carbon::parse($rosterStart);
    //         $rosterEndTime = Carbon::parse($rosterEnd);

    //         // Allow 5 minutes grace
    //         $graceStart = $rosterStartTime->copy()->addMinutes(5);

    //         if ($inTime > $graceStart) {
    //             $status = 'Late';
    //         } elseif ($inTime->eq($outTime)) {
    //             $status = 'Absent';
    //         } elseif ($outTime < $rosterEndTime) {
    //             $status = 'Left Early';
    //         } else {
    //             $status = 'Present';
    //         }

    //         return [
    //             'employee_id' => $att->employee_id,
    //             'name' => $employee?->name ?? 'N/A',
    //             'date' => $att->date,
    //             'in_time' => $att->in_time,
    //             'out_time' => $att->out_time,
    //             'status' => $status,
    //             'source' => $att->source,
    //         ];
    //     });

    //     return Inertia::render('Payroll/PayrollReport', [
    //         'reportData' => $report,
    //     ]);
    // }
}
