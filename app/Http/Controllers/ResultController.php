<?php

namespace App\Http\Controllers;

use App\Models\Result;
use App\Http\Requests\StoreResultRequest;
use App\Http\Requests\UpdateResultRequest;
use App\Models\Exam;
use App\Models\Student;
use App\Models\Subject;
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
        $examId = $request->exam_id;

        foreach ($request->results as $studentId => $subjects) {
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
        return Inertia::render('Institute-Managements/Results/CreateResultSingle', [
            'exams' => Exam::all(),
            'subjects' => Subject::all(),
            'students' => Student::with('schoolClass', 'section')->get(),
        ]);
    }

    public function fetchStudentData($studentId)
    {
        $student = Student::with(['schoolClass', 'section'])->findOrFail($studentId);

        $subjects = Subject::all();
        $exams = Exam::all();

        // আগের Result গুলো Student ID দিয়ে নিয়ে আসা
        $results = Result::where('student_id', $studentId)->get();

        return response()->json([
            'student' => $student,
            'subjects' => $subjects,
            'exams' => $exams,
            'results' => $results, // নতুন করে পাঠানো হচ্ছে
        ]);
    }


    public function storeResultSingle(StoreResultRequest $request)
    {
        $examId = $request->exam_id;

        foreach ($request->results as $studentId => $subjects) {
            foreach ($subjects as $subjectId => $marks) {
                Result::updateOrCreate(
                    [
                        'student_id' => $studentId,
                        'exam_id' => $examId,
                        'subject_id' => $subjectId,
                    ],
                    [
                        'marks_obtained' => $marks,
                        'grade' => $this->calculateSingleGrade($marks),
                    ]
                );
            }
        }

        return back()->with('success', 'Results saved successfully!');
    }

    private function calculateSingleGrade($marks)
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
