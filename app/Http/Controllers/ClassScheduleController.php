<?php

namespace App\Http\Controllers;

use App\Models\ClassSchedule;
use App\Http\Requests\StoreClassScheduleRequest;
use App\Http\Requests\UpdateClassScheduleRequest;
use App\Models\Holiday;
use App\Models\SchoolClass;
use Inertia\Inertia;

class ClassScheduleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
{
    $schedules = ClassSchedule::with(['schoolClass', 'section'])->get();
    return Inertia::render('Institute-Managements/ClassSchedule/ViewClassSchedule', [
        'schedules' => $schedules
    ]);
}


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $classes = SchoolClass::with('sections')->get();
        return Inertia::render('Institute-Managements/ClassSchedule/CreateClassSchedule', [
            'classes' => $classes
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreClassScheduleRequest $request)
    {
    $validated = $request->validate([
        'school_class_id' => 'required|exists:school_classes,id',
        'section_id'      => 'required|exists:sections,id',
        'schedule_name'   => 'required|string',
        'start_time'      => 'required|date_format:H:i',
        'end_time'        => 'required|date_format:H:i|after:start_time',
    ]);

    ClassSchedule::create($validated);

    return redirect()->route('class-schedule.index')->with('success', 'Schedule created!');
}


    /**
     * Display the specified resource.
     */
    public function show(ClassSchedule $classSchedule)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ClassSchedule $classSchedule)
    {
        $classes = SchoolClass::with('sections')->get();
        return Inertia::render('Institute-Managements/ClassSchedule/EditClassSchedule', [
            'schedule' => $classSchedule,
            'classes' => $classes
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateClassScheduleRequest $request, ClassSchedule $classSchedule)
    {
        $validated = $request->validate([
        'school_class_id' => 'required|exists:school_classes,id',
        'section_id'      => 'required|exists:sections,id',
        'schedule_name'   => 'required|string|max:255',
        'start_time'      => 'required|date_format:H:i',
        'end_time'        => 'required|date_format:H:i|after:start_time',
    ]);

        $classSchedule->update($validated);

    return redirect()->route('class-schedule.index')
                     ->with('success', 'Schedule updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ClassSchedule $classSchedule)
    {
        $classSchedule->delete();
        return redirect()->back()->with('success', 'Schedule deleted');
    }
}
