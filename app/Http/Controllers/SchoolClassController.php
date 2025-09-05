<?php

namespace App\Http\Controllers;

use App\Models\SchoolClass;
use App\Http\Requests\StoreSchoolClassRequest;
use App\Http\Requests\UpdateSchoolClassRequest;
use App\Models\ClassSchedule;
use App\Models\Section;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SchoolClassController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
{
    $classes = SchoolClass::with(['sections', 'schedules'])->get();
    return inertia('Institute-Managements/School-Class/ViewSchoolClasses', compact('classes'));
}


    public function storeClass(Request $request)
    {
        $request->validate(['name' => 'required']);
        SchoolClass::create($request->only('name'));
        return back()->with('success', 'Class created successfully');
    }

    public function storeSection(Request $request)
    {
        $request->validate([
            'school_class_id' => 'required|exists:school_classes,id',
            'name' => 'required'
        ]);
        Section::create($request->only('school_class_id', 'name'));
        return back()->with('success', 'Section created successfully');
    }

    public function storeSchedule(Request $request)
    {
        $request->validate([
            'school_class_id' => 'required|exists:school_classes,id',
            'section_id' => 'required|exists:sections,id',
            'subject' => 'required',
            'teacher' => 'required',
            'day' => 'required',
            'start_time' => 'required',
            'end_time' => 'required',
        ]);
        ClassSchedule::create($request->all());
        return back()->with('success', 'Schedule created successfully');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Institute-Managements/School-Class/CreateSchoolClass');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSchoolClassRequest $request)
    {
        $validated = $request->validate([
            'class_name' => 'required|string|unique:school_classes,class_name',
        ]);

        SchoolClass::create($validated);

        return redirect()->route('classes.index')->with('success', 'Class created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(SchoolClass $schoolClass)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(SchoolClass $schoolClass)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSchoolClassRequest $request, SchoolClass $schoolClass)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(SchoolClass $schoolClass)
    {
        $schoolClass->delete();
        return redirect()->back()->with('success', 'Class deleted');
    }
}
