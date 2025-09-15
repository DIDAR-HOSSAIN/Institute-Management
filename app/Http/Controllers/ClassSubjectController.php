<?php

namespace App\Http\Controllers;

use App\Models\ClassSubject;
use App\Http\Requests\StoreClassSubjectRequest;
use App\Http\Requests\UpdateClassSubjectRequest;
use App\Models\SchoolClass;
use App\Models\Subject;
use Inertia\Inertia;

class ClassSubjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $classes = SchoolClass::with('subjects')->get();
        $subjects = Subject::all();

        return Inertia::render('Institute-Managements/ClassSubject/CreateClassSubject', [
            'classes' => $classes,
            'subjects' => $subjects,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $classes = SchoolClass::with('subjects')->get();
        $subjects = Subject::all();

        return Inertia::render('Institute-Managements/ClassSubject/CreateClassSubject', [
            'classes' => $classes,
            'subjects' => $subjects,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreClassSubjectRequest $request)
    {
        if ($request->type === 'subject') {
            $request->validate([
                'subject_name' => 'required|string|max:255',
                'subject_code' => 'required|string|max:50|unique:subjects,subject_code',
                'full_mark' => 'required|numeric',
                'pass_mark' => 'required|numeric',
            ]);

            Subject::create($request->only('subject_name', 'subject_code', 'full_mark', 'pass_mark'));

            return redirect()->route('class-subject.index')->with('success', 'Subject created successfully');
        }

        if ($request->type === 'class_subject') {
            $request->validate([
                'school_class_id' => 'required|exists:school_classes,id',
                'subject_ids' => 'required|array',
            ]);

            $class = SchoolClass::findOrFail($request->school_class_id);
            $class->subjects()->sync($request->subject_ids);

            return redirect()->route('class-subject.index')->with('success', 'Subjects assigned successfully');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(ClassSubject $classSubject)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ClassSubject $classSubject)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateClassSubjectRequest $request, ClassSubject $classSubject)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ClassSubject $classSubject)
    {
        //
    }
}
