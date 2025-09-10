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
            'student.schoolClass',  // Student এর সাথে Class
            'classFee.fee',         // ClassFee এর সাথে Fee
            'payments'              // Payments
        ])->get();

        return inertia('Institute-Managements/StudentFee/ViewStudentFee', compact('studentFees'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create($studentId)
    {
        $student = Student::with('schoolClass')->findOrFail($studentId);

        // সব ফি
        $fees = ClassFee::with('fee')
            ->where('class_id', $student->school_class_id)
            ->get();

        // Student এর paid data
        $studentFees = StudentFee::with('classFee.fee', 'payments')
            ->where('student_id', $student->id)
            ->get();

        // ==== Paid Data প্রসেস ====
        $paidTuitionMonths = [];
        $paidExams = [];
        $admissionPaid = false;

        foreach ($studentFees as $fee) {
            if ($fee->classFee->fee->name === 'Tuition') {
                $paidTuitionMonths = array_merge($paidTuitionMonths, $fee->payments->pluck('month')->filter()->toArray());
            }

            if ($fee->classFee->fee->name === 'Admission' && $fee->payments->count() > 0) {
                $admissionPaid = true;
            }

            if ($fee->classFee->fee->type === 'exam' && $fee->payments->count() > 0) {
                $paidExams[] = $fee->classFee->fee_id;
            }
        }

        $paidTuitionMonths = array_unique($paidTuitionMonths);

        return Inertia::render('Institute-Managements/StudentFee/CreateStudentFee', [
            'student' => $student,
            'fees' => $fees,
            'studentFees' => $studentFees,

            // extra data
            'paidTuitionMonths' => $paidTuitionMonths,
            'paidExams' => $paidExams,
            'admissionPaid' => $admissionPaid,
        ]);
    }



    /**
     * Store a newly created resource in storage.
     */
    // public function store(Request $request)
    // {
    //     $student = Student::findOrFail($request->student_id);

    //     // Payment method default
    //     $paymentMethod = $request->payment_method ?? 'Cash';

    //     // Tuition (Recurring)
    //     if (!empty($request->tuition_months)) {
    //         $classFee = ClassFee::with('fee')
    //             ->where('class_id', $student->school_class_id)
    //             ->whereHas('fee', fn($q) => $q->where('name', 'Tuition'))
    //             ->first();

    //         if ($classFee) {
    //             // StudentFee main record
    //             $studentFee = StudentFee::firstOrCreate(
    //                 [
    //                     'student_id'   => $student->id,
    //                     'class_fee_id' => $classFee->id,
    //                 ],
    //                 [
    //                     'total_paid'        => 0,
    //                     'months'            => [],
    //                     'payment_method'    => $paymentMethod,
    //                     'last_payment_date' => now(),
    //                 ]
    //             );

    //             foreach ($request->tuition_months as $month) {
    //                 // Skip if already paid
    //                 if (!StudentFeePayment::where('student_fee_id', $studentFee->id)
    //                     ->where('month', $month)
    //                     ->exists()) {

    //                     StudentFeePayment::create([
    //                         'student_fee_id' => $studentFee->id,
    //                         'paid_amount'    => $classFee->amount, // full amount per month
    //                         'payment_method' => $paymentMethod,
    //                         'month'          => $month,
    //                         'payment_date'   => now(),
    //                     ]);
    //                 }
    //             }

    //             // Update StudentFee
    //             $studentFee->update([
    //                 'total_paid'        => StudentFeePayment::where('student_fee_id', $studentFee->id)->sum('paid_amount'),
    //                 'months'            => StudentFeePayment::where('student_fee_id', $studentFee->id)->pluck('month')->filter()->unique()->values()->toArray(),
    //                 'payment_method'    => $paymentMethod,
    //                 'last_payment_date' => now(),
    //             ]);
    //         }
    //     }

    //     // Exam Fees
    //     if (!empty($request->exams)) {
    //         foreach ($request->exams as $examFeeId) {
    //             $classFee = ClassFee::with('fee')
    //                 ->where('class_id', $student->school_class_id)
    //                 ->where('fee_id', $examFeeId)
    //                 ->first();

    //             if ($classFee) {
    //                 $studentFee = StudentFee::firstOrCreate(
    //                     [
    //                         'student_id'   => $student->id,
    //                         'class_fee_id' => $classFee->id,
    //                     ],
    //                     [
    //                         'total_paid'        => 0,
    //                         'months'            => [],
    //                         'payment_method'    => $paymentMethod,
    //                         'last_payment_date' => now(),
    //                     ]
    //                 );

    //                 if (!StudentFeePayment::where('student_fee_id', $studentFee->id)->exists()) {
    //                     StudentFeePayment::create([
    //                         'student_fee_id' => $studentFee->id,
    //                         'paid_amount'    => $classFee->amount,
    //                         'payment_method' => $paymentMethod,
    //                         'month'          => null,
    //                         'payment_date'   => now(),
    //                     ]);
    //                 }

    //                 $studentFee->update([
    //                     'total_paid'        => StudentFeePayment::where('student_fee_id', $studentFee->id)->sum('paid_amount'),
    //                     'payment_method'    => $paymentMethod,
    //                     'last_payment_date' => now(),
    //                 ]);
    //             }
    //         }
    //     }

    //     // Admission Fee (One-time)
    //     if ($request->admission) {
    //         $classFee = ClassFee::with('fee')
    //             ->where('class_id', $student->school_class_id)
    //             ->whereHas('fee', fn($q) => $q->where('name', 'Admission'))
    //             ->first();

    //         if ($classFee) {
    //             $studentFee = StudentFee::firstOrCreate(
    //                 [
    //                     'student_id'   => $student->id,
    //                     'class_fee_id' => $classFee->id,
    //                 ],
    //                 [
    //                     'total_paid'        => 0,
    //                     'months'            => [],
    //                     'payment_method'    => $paymentMethod,
    //                     'last_payment_date' => now(),
    //                 ]
    //             );

    //             if (!StudentFeePayment::where('student_fee_id', $studentFee->id)->exists()) {
    //                 StudentFeePayment::create([
    //                     'student_fee_id' => $studentFee->id,
    //                     'paid_amount'    => $classFee->amount,
    //                     'payment_method' => $paymentMethod,
    //                     'month'          => null,
    //                     'payment_date'   => now(),
    //                 ]);
    //             }

    //             $studentFee->update([
    //                 'total_paid'        => StudentFeePayment::where('student_fee_id', $studentFee->id)->sum('paid_amount'),
    //                 'payment_method'    => $paymentMethod,
    //                 'last_payment_date' => now(),
    //             ]);
    //         }
    //     }

    //     return back()->with('success', 'Fees recorded successfully!');
    // }





    public function store(Request $request)
{
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

    return response()->json(['success' => true, 'message' => 'Fees recorded successfully!']);
}



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


    public function createEmpty()
    {
        return Inertia::render('Institute-Managements/StudentFee/CreateStudentFee', [
            'student' => null,
            'fees' => [],
            'studentFees' => [],
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



    // public function fetch($student_id)
    // {
    //     $student = Student::with('schoolClass')->findOrFail($student_id);

    //     $fees = ClassFee::with('fee')
    //         ->where('class_id', $student->school_class_id)
    //         ->get();

    //     $studentFees = StudentFee::with('classFee.fee', 'payments')
    //         ->where('student_id', $student_id)
    //         ->get();

    //     return response()->json([
    //         'student' => $student,
    //         'fees' => $fees,
    //         'studentFees' => $studentFees,
    //     ]);
    // }
}
