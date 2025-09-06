<?php

namespace App\Http\Controllers;

use App\Models\Leave;
use App\Http\Requests\StoreLeaveRequest;
use App\Http\Requests\UpdateLeaveRequest;
use App\Models\Student;

class LeaveController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $leaves = Leave::with('student')->orderBy('start_date', 'desc')->paginate(10);
        return inertia('Institute-Managements/Leaves/ViewLeaves', compact('leaves'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $students = Student::select('id', 'student_name', 'roll_number')->get();
        return inertia('Institute-Managements/Leaves/CreateLeave', compact('students'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreLeaveRequest $request)
    {
        $request->validate([
            'student_id' => 'required|exists:students,id',
            'start_date' => 'required|date',
            'end_date'   => 'required|date|after_or_equal:start_date',
            'reason'     => 'nullable|string',
            'status'     => 'required|in:Approved,Pending,Rejected',
        ]);

        Leave::create([
            'student_id' => $request->input('student_id'),
            'start_date' => $request->input('start_date'),
            'end_date'   => $request->input('end_date'),
            'reason'     => $request->input('reason'),
            'status'     => $request->input('status', 'Pending'), // default Pending
        ]);

        return redirect()->route('leaves.index')->with('success', 'Leave created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Leave $leave)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Leave $leave)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateLeaveRequest $request, Leave $leave)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Leave $leave)
    {
        //
    }
}
