<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Http\Requests\StoreStudentRequest;
use App\Http\Requests\UpdateStudentRequest;
use App\Models\SchoolClass;
use App\Models\Section;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class StudentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Institute-Managements/Students/ViewStudents', [
            'students' => Student::with(['class', 'section'])->latest()->get(),
            'classes' => SchoolClass::all(),
            'sections' => Section::all(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {

        return Inertia::render('Institute-Managements/Students/CreateStudent');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreStudentRequest $request)
    {
        $validator = Validator::make($request->all(), [
            'student_name' => 'required|string|max:255',
            'roll_number' => 'required|string|max:50|unique:students,roll_number',
            'class_id'     => 'required|exists:school_classes,id',
            'section_id'   => 'required|exists:sections,id',
            'dob'          => 'nullable|date',
            'academic_year' => 'nullable|string',
            'gender'       => 'nullable|string',
            'contact_no'   => 'nullable|string',
            'address'      => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return redirect()->back()
                ->withErrors($validator)
                ->withInput();
        }

        Student::create($validator->validated());

        return redirect()->back()->with('success', 'Student added successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Student $student)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Student $student)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateStudentRequest $request, Student $student)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Student $student)
    {
        //
    }
}
