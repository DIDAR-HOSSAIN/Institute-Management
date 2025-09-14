<?php

namespace App\Http\Controllers;

use App\Models\Result;
use App\Http\Requests\StoreResultRequest;
use App\Http\Requests\UpdateResultRequest;
use App\Models\Exam;
use App\Models\Student;
use App\Models\Subject;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ResultController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Institute-Managements/Results/CreateResultExamWise', [
            'exams' => Exam::all(),
            'subjects' => Subject::all(),
            'students' => Student::with('schoolClass', 'section')->get(),
        ]);
    }


    /**
     * Store a newly created resource in storage.
     */

    public function store(StoreResultRequest $request)
    {
        $examId = $request->validated()['exam_id'];
        $results = $request->validated()['results'];

        foreach ($results as $studentId => $subjects) {
            foreach ($subjects as $subjectId => $marks) {
                Result::updateOrCreate(
                    [
                        'student_id' => $studentId,
                        'exam_id' => $examId,
                        'subject_id' => $subjectId,
                    ],
                    [
                        'marks_obtained' => $marks,
                        'grade' => $this->calculateGrade($marks),
                    ]
                );
            }
        }

        return back()->with('success', 'Results saved successfully!');
    }

    private function calculateGrade($marks)
    {
        if ($marks >= 80) return 'A+';
        if ($marks >= 70) return 'A';
        if ($marks >= 60) return 'A-';
        if ($marks >= 50) return 'B';
        if ($marks >= 40) return 'C';
        return 'F';
    }



    //create Result Single Studnent according id

    public function createResultSingle()
    {
        return Inertia::render('Institute-Managements/Results/CreateResultSingle');
    }

    public function fetchStudentData($studentId)
    {
        $student = Student::with('schoolClass')->findOrFail($studentId);

        $subjects = Subject::all(['id', 'subject_name']);
        $exams = Exam::all(['id', 'exam_name']);

        return response()->json([
            'student' => [
                'id' => $student->id,
                'name' => $student->student_name, // column name ঠিক করো
                'class_name' => $student->schoolClass?->class_name,
            ],
            'subjects' => $subjects,
            'exams' => $exams,
        ]);
    }

    // ResultController.php
    public function fetchStudentExamData($studentId, $examId)
    {
        // student fetch
        $student = Student::with('schoolClass')->find($studentId);
        if (!$student) {
            return response()->json(['message' => 'Student not found'], 404);
        }

        // subjects
        $subjects = Subject::all(['id', 'subject_name']);

        // results
        $results = Result::where('student_id', $studentId)
            ->where('exam_id', $examId)
            ->get(['subject_id', 'marks_obtained']);

        // convert to {subject_id: marks} format
        $marks = $results->pluck('marks_obtained', 'subject_id');

        return response()->json([
            'student' => [
                'id' => $student->id,
                'name' => $student->student_name, // adjust column name
                'class_name' => $student->schoolClass?->class_name
            ],
            'subjects' => $subjects,
            'results' => $marks
        ]);
    }




    public function storeResultSingle(Request $request)
    {
        $examId = $request->exam_id;
        $studentId = $request->student_id;

        foreach ($request->marks as $subjectId => $marks) {
            Result::updateOrCreate(
                [
                    'student_id' => $studentId,
                    'exam_id' => $examId,
                    'subject_id' => $subjectId,
                ],
                [
                    'marks_obtained' => $marks,
                    'grade' => $this->calculateStudentGrade($marks),
                ]
            );
        }

        return back()->with('success', 'Results saved successfully!');
    }

    private function calculateStudentGrade($marks)
    {
        if ($marks >= 80) return 'A+';
        if ($marks >= 70) return 'A';
        if ($marks >= 60) return 'A-';
        if ($marks >= 50) return 'B';
        if ($marks >= 40) return 'C';
        return 'F';
    }

    /**
     * Display the specified resource.
     */
    public function show(Result $result)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Result $result)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateResultRequest $request, Result $result)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Result $result)
    {
        //
    }
}
