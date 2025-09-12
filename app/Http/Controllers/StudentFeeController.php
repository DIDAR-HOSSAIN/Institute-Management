<?php

namespace App\Http\Controllers;

use App\Models\StudentFee;
use App\Http\Requests\UpdateStudentFeeRequest;
use App\Models\ClassFee;
use App\Models\Fee;
use App\Models\Student;
use App\Models\StudentFeePayment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
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
        // dd($request->all());
        $request->validate([
            'student_id' => 'required|exists:students,id',
            'payment_method' => 'required|string',
        ]);


        DB::transaction(function () use ($request) {
            $payment_date   = now();
            $payment_method = $request->payment_method ?? 'Cash';

            // 🟢 master row খুঁজে বের করো, না থাকলে তৈরি করো
            $studentFee = StudentFee::firstOrCreate(
                ['student_id' => $request->student_id],
                ['total_paid' => 0, 'last_payment_date' => $payment_date]
            );

            // 🟢 Tuition fees (unique month check)
            if (!empty($request->tuition_months)) {
                foreach ($request->tuition_months as $month) {
                    $exists = StudentFeePayment::where('student_fee_id', $studentFee->id)
                        ->where('type', 'tuition')
                        ->where('month', $month)
                        ->exists();

                    if (!$exists) {
                        StudentFeePayment::create([
                            'student_fee_id' => $studentFee->id,
                            'type'           => 'tuition',
                            'month'          => $month,
                            'payment_date'   => $payment_date,
                            'paid_amount'    => 500, // dynamic tuition fee
                            'payment_method' => $payment_method,
                        ]);
                    }
                }
            }

            // 🟢 Admission fee (only once)
            if ($request->admission) {
                $exists = StudentFeePayment::where('student_fee_id', $studentFee->id)
                    ->where('type', 'admission')
                    ->exists();

                if (!$exists) {
                    StudentFeePayment::create([
                        'student_fee_id' => $studentFee->id,
                        'type'           => 'admission',
                        'month'          => null,
                        'payment_date'   => $payment_date,
                        'paid_amount'    => 5000, // dynamic admission fee
                        'payment_method' => $payment_method,
                    ]);
                }
            }

            // 🟢 Exam fees (only once)
            if (!empty($request->exams)) {
                $exists = StudentFeePayment::where('student_fee_id', $studentFee->id)
                    ->where('type', 'exam')
                    ->exists();

                if (!$exists) {
                    StudentFeePayment::create([
                        'student_fee_id' => $studentFee->id,
                        'type'           => 'exam',
                        'month'          => null,
                        'payment_date'   => $payment_date,
                        'paid_amount'    => 1000, // dynamic exam fee
                        'payment_method' => $payment_method,
                    ]);
                }
            }


            // 🟢 শেষে total_paid update
            $totalPaid = StudentFeePayment::where('student_fee_id', $studentFee->id)->sum('paid_amount');

            $studentFee->update([
                'total_paid'        => $totalPaid,
                'last_payment_date' => $payment_date,
            ]);
        });

        return redirect()->route('studentFees.index')->with('success', 'Fees updated successfully!');
    }




    // public function store(Request $request)
    // {
    //     try {
    //         $request->validate([
    //             'student_id' => 'required|exists:students,id',
    //             'tuition_months' => 'nullable|array',
    //             'exams' => 'nullable|array',
    //             'admission' => 'nullable|boolean',
    //             'payment_method' => 'required|string|in:Cash,Bkash,Bank',
    //         ]);

    //         $student = Student::findOrFail($request->student_id);
    //         $paymentMethod = $request->payment_method;

    //         // -------------------------------
    //         // 1️⃣ Tuition Fee (Recurring)
    //         // -------------------------------
    //         if (!empty($request->tuition_months)) {
    //             $classFee = ClassFee::with('fee')
    //                 ->where('class_id', $student->school_class_id)
    //                 ->whereHas('fee', fn($q) => $q->where('name', 'Tuition'))
    //                 ->first();

    //             if ($classFee) {
    //                 $studentFee = StudentFee::firstOrCreate(
    //                     ['student_id' => $student->id, 'class_fee_id' => $classFee->id],
    //                     ['total_paid' => 0, 'months' => [], 'payment_method' => $paymentMethod, 'last_payment_date' => now()]
    //                 );

    //                 foreach ($request->tuition_months as $month) {
    //                     $alreadyPaid = StudentFeePayment::where('student_fee_id', $studentFee->id)
    //                         ->where('month', $month)
    //                         ->exists();

    //                     if (!$alreadyPaid) {
    //                         StudentFeePayment::create([
    //                             'student_fee_id' => $studentFee->id,
    //                             'paid_amount' => $classFee->amount,
    //                             'payment_method' => $paymentMethod,
    //                             'month' => $month,
    //                             'payment_date' => now(),
    //                         ]);
    //                     }
    //                 }

    //                 // 🔥 merge months & update total_paid
    //                 $months = collect($studentFee->months)
    //                     ->merge(StudentFeePayment::where('student_fee_id', $studentFee->id)->pluck('month')->filter())
    //                     ->unique()
    //                     ->values()
    //                     ->toArray();

    //                 $studentFee->update([
    //                     'total_paid' => StudentFeePayment::where('student_fee_id', $studentFee->id)->sum('paid_amount'),
    //                     'months' => $months,
    //                     'payment_method' => $paymentMethod,
    //                     'last_payment_date' => now(),
    //                 ]);
    //             }
    //         }

    //         // -------------------------------
    //         // 2️⃣ Exam Fees (One-time)
    //         // -------------------------------
    //         if (!empty($request->exams)) {
    //             foreach ($request->exams as $examFeeId) {
    //                 $classFee = ClassFee::with('fee')
    //                     ->where('class_id', $student->school_class_id)
    //                     ->where('fee_id', $examFeeId)
    //                     ->first();

    //                 if ($classFee) {
    //                     $studentFee = StudentFee::firstOrCreate(
    //                         ['student_id' => $student->id, 'class_fee_id' => $classFee->id],
    //                         ['total_paid' => 0, 'months' => [], 'payment_method' => $paymentMethod, 'last_payment_date' => now()]
    //                     );

    //                     $alreadyPaid = StudentFeePayment::where('student_fee_id', $studentFee->id)->exists();

    //                     if (!$alreadyPaid) {
    //                         StudentFeePayment::create([
    //                             'student_fee_id' => $studentFee->id,
    //                             'paid_amount' => $classFee->amount,
    //                             'payment_method' => $paymentMethod,
    //                             'month' => null,
    //                             'payment_date' => now(),
    //                         ]);
    //                     }

    //                     $studentFee->update([
    //                         'total_paid' => StudentFeePayment::where('student_fee_id', $studentFee->id)->sum('paid_amount'),
    //                         'payment_method' => $paymentMethod,
    //                         'last_payment_date' => now(),
    //                     ]);
    //                 }
    //             }
    //         }

    //         // -------------------------------
    //         // 3️⃣ Admission Fee (One-time)
    //         // -------------------------------
    //         if (!empty($request->admission)) {
    //             $classFee = ClassFee::with('fee')
    //                 ->where('class_id', $student->school_class_id)
    //                 ->whereHas('fee', fn($q) => $q->where('name', 'Admission'))
    //                 ->first();

    //             if ($classFee) {
    //                 $studentFee = StudentFee::firstOrCreate(
    //                     ['student_id' => $student->id, 'class_fee_id' => $classFee->id],
    //                     ['total_paid' => 0, 'months' => [], 'payment_method' => $paymentMethod, 'last_payment_date' => now()]
    //                 );

    //                 $alreadyPaid = StudentFeePayment::where('student_fee_id', $studentFee->id)->exists();

    //                 if (!$alreadyPaid) {
    //                     StudentFeePayment::create([
    //                         'student_fee_id' => $studentFee->id,
    //                         'paid_amount' => $classFee->amount,
    //                         'payment_method' => $paymentMethod,
    //                         'month' => null,
    //                         'payment_date' => now(),
    //                     ]);
    //                 }

    //                 $studentFee->update([
    //                     'total_paid' => StudentFeePayment::where('student_fee_id', $studentFee->id)->sum('paid_amount'),
    //                     'payment_method' => $paymentMethod,
    //                     'last_payment_date' => now(),
    //                 ]);
    //             }
    //         }

    //         return redirect()->route('student-fees.create')->with('success', 'Fees recorded successfully!');
    //     } catch (\Exception $e) {
    //         return redirect()->back()->with('error', 'Something went wrong! ' . $e->getMessage());
    //     }
    // }




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
        DB::beginTransaction();

        try {
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

                // Delete old payments
                $studentFee->payments()->delete();

                $months = $feeData['months'] ?? [];

                if (!empty($months)) {
                    foreach ($months as $month) {
                        $studentFee->payments()->create([
                            'paid_amount' => $feeData['paid_amount'],
                            'payment_method' => $feeData['payment_method'],
                            'payment_date' => now(),
                            'month' => $month,
                        ]);
                    }
                } else {
                    $studentFee->payments()->create([
                        'paid_amount' => $feeData['paid_amount'],
                        'payment_method' => $feeData['payment_method'],
                        'payment_date' => now(),
                        'month' => null,
                    ]);
                }

                $studentFee->update([
                    'total_paid' => $studentFee->payments()->sum('paid_amount'),
                    'months' => $months,
                    'payment_method' => $feeData['payment_method'],
                    'last_payment_date' => now(),
                ]);
            }

            DB::commit();

            return redirect()->route('student-fees.index')
                ->with('success', 'All fees updated successfully!');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('UpdateAll Student Fees failed', ['error' => $e->getMessage()]);

            return back()->withErrors([
                'error' => 'Update failed: ' . $e->getMessage()
            ])->withInput();
        }
    }



    /**
     * Remove the specified resource from storage.
     */
    public function destroy(StudentFee $studentFee)
    {
        //
    }
}
