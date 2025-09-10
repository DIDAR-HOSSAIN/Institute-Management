<?php

namespace App\Http\Controllers;

use App\Models\StudentFee;
use App\Http\Requests\UpdateStudentFeeRequest;
use App\Models\ClassFee;
use App\Models\Fee;
use App\Models\Student;
use App\Models\StudentFeePayment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StudentFeeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $studentFees = StudentFee::with([
            'student.schoolClass',
            'classFee.fee',
            'payments'
        ])->get();

        return inertia('Institute-Managements/StudentFee/ViewStudentFee', compact('studentFees'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Institute-Managements/StudentFee/CreateStudentFee', [
            'student' => null,
            'fees' => [],
            'studentFees' => [],
            'paidTuitionMonths' => [],
            'paidExams' => [],
            'admissionPaid' => false,
        ]);
    }

    public function fetch($studentId)
    {
        $student = Student::with('schoolClass')->findOrFail($studentId);

        $fees = ClassFee::with('fee')
            ->where('class_id', $student->school_class_id)
            ->get();

        $studentFees = StudentFee::with('classFee.fee', 'payments')
            ->where('student_id', $student->id)
            ->get();

        return response()->json([
            'student' => $student,
            'fees' => $fees,
            'studentFees' => $studentFees,
        ]);
    }

    public function store(Request $request)
{

    try {
    $request->validate([
        'student_id' => 'required|exists:students,id',
        'tuition_months' => 'nullable|array',
        'exams' => 'nullable|array',
        'admission' => 'nullable|boolean',
        'payment_method' => 'required|string|in:Cash,Bkash,Bank',
    ]);

    $student = Student::findOrFail($request->student_id);
    $paymentMethod = $request->payment_method;

    // -------------------------------
    // 1️⃣ Tuition Fee (Recurring)
    // -------------------------------
    if (!empty($request->tuition_months)) {
        $classFee = ClassFee::with('fee')
            ->where('class_id', $student->school_class_id)
            ->whereHas('fee', fn($q) => $q->where('name', 'Tuition'))
            ->first();

        if ($classFee) {
            $studentFee = StudentFee::firstOrCreate(
                ['student_id' => $student->id, 'class_fee_id' => $classFee->id],
                ['total_paid' => 0, 'months' => [], 'payment_method' => $paymentMethod, 'last_payment_date' => now()]
            );

            foreach ($request->tuition_months as $month) {
                if (!StudentFeePayment::where('student_fee_id', $studentFee->id)->where('month', $month)->exists()) {
                    StudentFeePayment::create([
                        'student_fee_id' => $studentFee->id,
                        'paid_amount' => $classFee->amount,
                        'payment_method' => $paymentMethod,
                        'month' => $month,
                        'payment_date' => now(),
                    ]);
                }
            }

            $studentFee->update([
                'total_paid' => StudentFeePayment::where('student_fee_id', $studentFee->id)->sum('paid_amount'),
                'months' => StudentFeePayment::where('student_fee_id', $studentFee->id)->pluck('month')->filter()->unique()->values()->toArray(),
                'payment_method' => $paymentMethod,
                'last_payment_date' => now(),
            ]);
        }
    }

    // -------------------------------
    // 2️⃣ Exam Fees (One-time)
    // -------------------------------
    if (!empty($request->exams)) {
        foreach ($request->exams as $examFeeId) {
            $classFee = ClassFee::with('fee')
                ->where('class_id', $student->school_class_id)
                ->where('fee_id', $examFeeId)
                ->first();

            if ($classFee) {
                $studentFee = StudentFee::firstOrCreate(
                    ['student_id' => $student->id, 'class_fee_id' => $classFee->id],
                    ['total_paid' => 0, 'months' => [], 'payment_method' => $paymentMethod, 'last_payment_date' => now()]
                );

                if (!StudentFeePayment::where('student_fee_id', $studentFee->id)->exists()) {
                    StudentFeePayment::create([
                        'student_fee_id' => $studentFee->id,
                        'paid_amount' => $classFee->amount,
                        'payment_method' => $paymentMethod,
                        'month' => null,
                        'payment_date' => now(),
                    ]);
                }

                $studentFee->update([
                    'total_paid' => StudentFeePayment::where('student_fee_id', $studentFee->id)->sum('paid_amount'),
                    'payment_method' => $paymentMethod,
                    'last_payment_date' => now(),
                ]);
            }
        }
    }

    // -------------------------------
    // 3️⃣ Admission Fee (One-time)
    // -------------------------------
    if (!empty($request->admission)) {
        $classFee = ClassFee::with('fee')
            ->where('class_id', $student->school_class_id)
            ->whereHas('fee', fn($q) => $q->where('name', 'Admission'))
            ->first();

        if ($classFee) {
            $studentFee = StudentFee::firstOrCreate(
                ['student_id' => $student->id, 'class_fee_id' => $classFee->id],
                ['total_paid' => 0, 'months' => [], 'payment_method' => $paymentMethod, 'last_payment_date' => now()]
            );

            if (!StudentFeePayment::where('student_fee_id', $studentFee->id)->exists()) {
                StudentFeePayment::create([
                    'student_fee_id' => $studentFee->id,
                    'paid_amount' => $classFee->amount,
                    'payment_method' => $paymentMethod,
                    'month' => null,
                    'payment_date' => now(),
                ]);
            }

            $studentFee->update([
                'total_paid' => StudentFeePayment::where('student_fee_id', $studentFee->id)->sum('paid_amount'),
                'payment_method' => $paymentMethod,
                'last_payment_date' => now(),
            ]);
        }
    }

             return redirect()->back()->with('success', 'Fees recorded successfully!');
    } catch (\Exception $e) {
        return redirect()->back()->with('error', 'Something went wrong! ' . $e->getMessage());
    }
}




    /**
     * Display the specified resource.
     */
    public function show(StudentFee $studentFee)
    {
        $studentFee->load(['student.schoolClass', 'classFee.fee', 'payments']);

        return Inertia::render('Institute-Managements/StudentFee/ShowStudentFee', [
            'studentFees' => [$studentFee],
        ]);
    }
    


    /**
     * Show the form for editing the specified resource.
     */
    public function edit(StudentFee $studentFee)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateStudentFeeRequest $request, StudentFee $studentFee)
    {
        //
    }

    // Show edit page for all fees of a student
    public function editAll($student_id)
    {
        $student = Student::findOrFail($student_id);

        $studentFees = StudentFee::with('classFee.fee', 'payments')
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
            $classFee = ClassFee::where('class_id', $request->class_id ?? 0)
                ->where('fee_id', $feeData['fee_id'])
                ->first();

            if (!$classFee) continue;

            $studentFee = StudentFee::firstOrCreate([
                'student_id' => $student_id,
                'class_fee_id' => $classFee->id,
            ]);

            $months = $studentFee->months ?? [];
            if (!empty($feeData['months'])) {
                foreach ($feeData['months'] as $month) {
                    if (!in_array($month, $months)) {
                        $months[] = $month;
                        StudentFeePayment::firstOrCreate([
                            'student_fee_id' => $studentFee->id,
                            'month' => $month,
                        ], [
                            'paid_amount' => $feeData['paid_amount'],
                            'payment_method' => $feeData['payment_method'],
                            'payment_date' => now(),
                        ]);
                    }
                }
            } else {
                // One-time fee
                if (!StudentFeePayment::where('student_fee_id', $studentFee->id)
                    ->whereNull('month')->exists()) {
                    StudentFeePayment::create([
                        'student_fee_id' => $studentFee->id,
                        'paid_amount' => $feeData['paid_amount'],
                        'payment_method' => $feeData['payment_method'],
                        'month' => null,
                        'payment_date' => now(),
                    ]);
                }
            }

            $studentFee->update([
                'total_paid' => StudentFeePayment::where('student_fee_id', $studentFee->id)->sum('paid_amount'),
                'months' => $months,
                'payment_method' => $feeData['payment_method'],
                'last_payment_date' => now(),
            ]);
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
