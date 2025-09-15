<?php

namespace App\Http\Controllers;

use App\Models\Result;
use App\Http\Requests\StoreResultRequest;
use App\Http\Requests\UpdateResultRequest;
use App\Models\ClassSubject;
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
    public function index(Request $request)
    {
        $search = $request->input('search');
        $examId = $request->input('exam_id'); // ✅ নতুন exam filter
        $perPage = (int) $request->input('per_page', 20);

        if ($perPage <= 0) {
            $perPage = 20;
        }

        $results = Result::with(['student.schoolClass', 'exam', 'subject'])
            ->when($search, function ($query, $search) {
                $query->whereHas('student', function ($q) use ($search) {
                    $q->where('student_name', 'like', "%{$search}%")
                        ->orWhere('roll_number', 'like', "%{$search}%")
                        ->orWhere('id', $search);
                });
            })
            ->when($examId, function ($query, $examId) {
                $query->where('exam_id', $examId);
            })
            ->orderBy('student_id')
            ->orderBy('exam_id')
            ->paginate($perPage)
            ->withQueryString();

        // exam dropdown data পাঠানো
        $exams = Exam::select('id', 'exam_name')->get();

        return Inertia::render('Institute-Managements/Results/ViewResult', [
            'results' => $results,
            'exams'   => $exams,
            'filters' => [
                'search'   => $search,
                'exam_id'  => $examId,
                'per_page' => $perPage,
            ],
        ]);
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
        $student = Student::with('schoolClass')->find($studentId);

        if (!$student) {
            return response()->json(['message' => 'Student not found'], 404);
        }

        // class_subject থেকে subject নেব
        $subjects = ClassSubject::with('subject')
            ->where('school_class_id', $student->school_class_id)
            ->get()
            ->map(function ($cs) {
                return [
                    'id' => $cs->subject->id,
                    'subject_name' => $cs->subject->subject_name,
                ];
            });

        $exams = Exam::all(['id', 'exam_name']);

        return response()->json([
            'student' => [
                'id' => $student->id,
                'name' => $student->student_name,
                'class_name' => $student->schoolClass?->class_name,
            ],
            'subjects' => $subjects,
            'exams' => $exams,
        ]);
    }

    public function fetchStudentExamData($studentId, $examId)
    {
        $student = Student::with('schoolClass')->find($studentId);

        if (!$student) {
            return response()->json(['message' => 'Student not found'], 404);
        }

        $subjects = ClassSubject::with('subject')
            ->where('school_class_id', $student->school_class_id)
            ->get()
            ->map(function ($cs) {
                return [
                    'id' => $cs->subject->id,
                    'subject_name' => $cs->subject->subject_name,
                ];
            });

        $results = Result::where('student_id', $studentId)
            ->where('exam_id', $examId)
            ->get(['subject_id', 'marks_obtained']);

        $marks = $results->pluck('marks_obtained', 'subject_id');

        return response()->json([
            'student' => [
                'id' => $student->id,
                'name' => $student->student_name,
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

    public function marksheet($studentId, $examId)
    {
        $student = Student::with('schoolClass')->find($studentId);
        if (!$student) {
            return response()->json(['message' => 'Student not found!'], 404);
        }

        $exam = Exam::find($examId);
        if (!$exam) {
            return response()->json(['message' => 'Exam not found!'], 404);
        }

        // 🔹 Student class-এর subjects নিন
        $classSubjects = ClassSubject::where('school_class_id', $student->school_class_id)
            ->pluck('subject_id')
            ->toArray();

        // 🔹 Student-এর result fetch করুন
        $results = Result::with('subject')
            ->where('exam_id', $examId)
            ->where('student_id', $studentId)
            ->whereIn('subject_id', $classSubjects)
            ->get();

        $allStudents = Result::select('student_id')
            ->selectRaw('SUM(marks_obtained) as total_marks')
            ->where('exam_id', $examId) // শুধু exam filter
            ->groupBy('student_id')
            ->get();

        // 🔹 Rank assign করুন total_marks descending অনুযায়ী
        $sorted = $allStudents->sortByDesc('total_marks')->values();
        foreach ($sorted as $index => $s) {
            $s->rank = $index + 1;
        }

        // 🔹 Current student rank
        $studentRank = $sorted->firstWhere('student_id', $student->id)->rank ?? null;

        return Inertia::render('Institute-Managements/Results/MarkSheet', [
            'student'     => $student,
            'exam'        => $exam,
            'results'     => $results,
            'allStudents' => $sorted,
            'studentRank' => $studentRank
        ]);
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
