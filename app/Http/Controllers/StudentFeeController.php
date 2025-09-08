<?php

namespace App\Http\Controllers;

use App\Models\StudentFee;
use App\Http\Requests\StoreStudentFeeRequest;
use App\Http\Requests\UpdateStudentFeeRequest;
use App\Models\Fee;
use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StudentFeeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // $studentFees = StudentFee::with(['fee', 'payments', 'student'])->get();

        // return Inertia::render('Institute-Managements/StudentFee/ViewStudentFee', [
        //     'studentFees' => $studentFees,
        // ]);

        $studentFees = StudentFee::with(['student.schoolClass', 'fee'])->get();
        return inertia('Institute-Managements/StudentFee/ViewStudentFee', compact('studentFees'));
    }

    /**
     * Show the form for creating a new resource.
     */
    // StudentFeeController.php
    public function create()
    {
        $students = Student::with('schoolClass')->get(); // relation সহ
        $fees = Fee::all();

        return inertia('Institute-Managements/StudentFee/CreateStudentFee', compact('students', 'fees'));
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreStudentFeeRequest $request)
    {
        $request->validate([
            'student_id' => 'required',
            'fee_id' => 'required',
            'amount' => 'required|numeric',
            'payment_method' => 'required',
        ]);

        $studentFee = StudentFee::firstOrCreate(
            [
                'student_id' => $request->student_id,
                'fee_id'     => $request->fee_id,
            ],
            [
                'paid_amount' => 0,
                'payment_method' => $request->payment_method,
                'payment_history' => [],
                'payment_date' => now(), // ✅ always save date
            ]
        );

        // Add payment history
        $history = $studentFee->payment_history ?? [];
        $history[] = [
            'date' => now()->toDateString(),
            'amount' => $request->amount,
        ];

        $studentFee->update([
            'paid_amount' => $studentFee->paid_amount + $request->amount,
            'payment_history' => $history,
            'payment_method' => $request->payment_method,
            'payment_date' => now(), // ✅ update date
        ]);

        return redirect()->route('student-fees.index')->with('success', 'Payment recorded successfully!');
    }


    // public function store(Request $request, $studentId)
    // {
    //     $request->validate([
    //         'class_fee_id' => 'required|exists:class_fees,id',
    //         'paid_amount' => 'required|numeric|min:1',
    //         'payment_method' => 'required|in:Cash,Bkash,Bank',
    //     ]);

    //     $fee = StudentFee::firstOrCreate([
    //         'student_id' => $studentId,
    //         'class_fee_id' => $request->class_fee_id,
    //     ]);

    //     // append payment history
    //     $history = $fee->payment_history ?? [];
    //     $history[] = [
    //         'date' => now()->toDateString(),
    //         'amount' => $request->paid_amount,
    //         'method' => $request->payment_method
    //     ];

    //     $fee->update([
    //         'paid_amount' => $fee->paid_amount + $request->paid_amount,
    //         'payment_method' => $request->payment_method,
    //         'payment_history' => $history,
    //     ]);

    //     return redirect()->back()->with('success', 'Payment recorded successfully!');
    // }

    /**
     * Display the specified resource.
     */
    public function show(StudentFee $studentFee)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(StudentFee $studentFee)
    {
        $student = Student::findOrFail($studentFee);

        $studentFees = StudentFee::with('fee')
            ->where('student_id', $studentFee)
            ->get();

        $fees = Fee::all();

        return Inertia::render('Institute-Managements/StudentFee/EditStudentFee', [
            'student' => $student,
            'fees' => $fees,
            'studentFees' => $studentFees,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateStudentFeeRequest $request, StudentFee $studentFee)
    {

    }

    // Show edit page for all fees of a student
    public function editAll($student_id)
    {
        $student = Student::findOrFail($student_id);

        $studentFees = StudentFee::with('fee')
            ->where('student_id', $student_id)
            ->get();

        $fees = Fee::all();

        return Inertia::render('Institute-Managements/StudentFee/EditStudentFee', [
            'student' => $student,
            'fees' => $fees,
            'studentFees' => $studentFees,
        ]);
    }

    public function updateAll(Request $request, $student_id)
    {
        $request->validate([
            'fees' => 'required|array',
            'fees.*.fee_id' => 'required|exists:fees,id',
            'fees.*.paid_amount' => 'required|numeric|min:0',
            'fees.*.payment_method' => 'required|string|in:Cash,Bkash,Bank',
            'fees.*.months' => 'nullable|array',
        ]);

        foreach ($request->fees as $feeData) {
            // check if the fee row exists for this student and fee_id
            $studentFee = StudentFee::firstOrNew([
                'student_id' => $student_id,
                'fee_id' => $feeData['fee_id']
            ]);

            // merge months if recurring
            if (!empty($feeData['months'])) {
                $existingMonths = $studentFee->months ?? [];
                $mergedMonths = array_unique(array_merge($existingMonths, $feeData['months']));
                $studentFee->months = $mergedMonths;
            } else {
                $studentFee->months = $feeData['months'] ?? null;
            }

            $studentFee->paid_amount = $feeData['paid_amount'];
            $studentFee->payment_method = $feeData['payment_method'];
            $studentFee->payment_date = now();

            $studentFee->save();
        }

        return redirect()->route('student-fees.index')
            ->with('success', 'All fees updated successfully!');
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(StudentFee $studentFee)
    {
        //
    }
}
