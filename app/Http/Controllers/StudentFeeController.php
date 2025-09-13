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
            'classFee.fee',   // StudentFee এর সাথে relation
            'payments'        // শুধু payment গুলো
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
        $request->validate([
            'student_id' => 'required|exists:students,id',
            'payment_method' => 'required|string',
        ]);

        DB::transaction(function () use ($request) {
            $payment_date   = now();
            $payment_method = $request->payment_method ?? 'Cash';

            $studentFee = StudentFee::firstOrCreate(
                ['student_id' => $request->student_id],
                ['total_paid' => 0, 'last_payment_date' => $payment_date]
            );

            // Tuition fees
            if (!empty($request->tuition_months)) {
                $tuitionClassFee = ClassFee::where('class_id', $studentFee->student->school_class_id)
                    ->whereHas('fee', fn($q) => $q->where('name', 'Tuition'))
                    ->first();

                foreach ($request->tuition_months as $month) {
                    $exists = StudentFeePayment::where('student_fee_id', $studentFee->id)
                        ->where('type', 'tuition')
                        ->where('month', $month)
                        ->exists();

                    if (!$exists && $tuitionClassFee) {
                        StudentFeePayment::create([
                            'student_fee_id' => $studentFee->id,
                            'class_fee_id'   => $tuitionClassFee->id,
                            'type'           => 'tuition',
                            'month'          => $month,
                            'payment_date'   => $payment_date,
                            'paid_amount'    => $tuitionClassFee->amount,
                            'payment_method' => $payment_method,
                        ]);
                    }
                }
            }

            // Admission fee
            if ($request->admission) {
                $admissionClassFee = ClassFee::where('class_id', $studentFee->student->school_class_id)
                    ->whereHas('fee', fn($q) => $q->where('name', 'Admission'))
                    ->first();

                $exists = StudentFeePayment::where('student_fee_id', $studentFee->id)
                    ->where('type', 'admission')
                    ->exists();

                if (!$exists && $admissionClassFee) {
                    StudentFeePayment::create([
                        'student_fee_id' => $studentFee->id,
                        'class_fee_id'   => $admissionClassFee->id,
                        'type'           => 'admission',
                        'month'          => null,
                        'payment_date'   => $payment_date,
                        'paid_amount'    => $admissionClassFee->amount,
                        'payment_method' => $payment_method,
                    ]);
                }
            }

            // Exam fees
            if (!empty($request->exams)) {
                foreach ($request->exams as $classFeeId) {
                    $classFee = ClassFee::with('fee')->find($classFeeId);
                    if (!$classFee) continue;

                    $exists = StudentFeePayment::where('student_fee_id', $studentFee->id)
                        ->where('type', 'exam')
                        ->where('class_fee_id', $classFeeId)
                        ->exists();

                    if (!$exists) {
                        StudentFeePayment::create([
                            'student_fee_id' => $studentFee->id,
                            'class_fee_id'   => $classFeeId,
                            'type'           => 'exam',
                            'month'          => $classFee->fee->name, // e.g. "1st Terminal"
                            'payment_date'   => $payment_date,
                            'paid_amount'    => $classFee->amount,
                            'payment_method' => $payment_method,
                        ]);
                    }
                }
            }

            // Update total
            $totalPaid = StudentFeePayment::where('student_fee_id', $studentFee->id)->sum('paid_amount');

            $studentFee->update([
                'total_paid'        => $totalPaid,
                'last_payment_date' => $payment_date,
            ]);
        });

        return redirect()->route('student-fees.index')->with('success', 'Fees updated successfully!');
    }


    /**
     * Show the form for editing the specified resource.
     */

     public function show($studentId)
    {
        $studentFee = StudentFee::with([
            'student.schoolClass',
            'payments.studentFee.classFee'
        ])->where('student_id', $studentId)->firstOrFail();

        return Inertia::render('Institute-Managements/StudentFee/ShowStudentFee', [
            'studentFee' => $studentFee
        ]);
    }

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

    public function createEdit()
    {
        // সমস্ত ClassFee + Fee relation নিয়ে আসি, exam সহ
        $fees = ClassFee::with('fee')->get();

        return Inertia::render('Institute-Managements/StudentFee/EditStudentFee', [
            'student' => null,
            'fees' => $fees,
            'studentFees' => [],
            'paidTuitionMonths' => [],
            'paidExams' => [],
            'admissionPaid' => false,
        ]);
    }

    public function fetchEdit($studentId)
    {
        $student = Student::with('schoolClass')->findOrFail($studentId);

        $fees = ClassFee::with('fee')
            ->where('class_id', $student->school_class_id)
            ->get();

        $studentFees = StudentFee::with('payments.classFee.fee')
            ->where('student_id', $student->id)
            ->get();

        // paid info
        $payments = $studentFees->flatMap(fn($sf) => $sf->payments);

        $paidTuitionMonths = $payments->where('type', 'tuition')->pluck('month')->unique()->values();
        $paidExams = $payments->where('type', 'exam')->pluck('class_fee_id')->unique()->values();
        $admissionPaid = $payments->where('type', 'admission')->isNotEmpty();

        return response()->json([
            'student' => $student,
            'fees' => $fees,
            'studentFees' => $studentFees,
            'paidTuitionMonths' => $paidTuitionMonths,
            'paidExams' => $paidExams,
            'admissionPaid' => $admissionPaid,
        ]);
    }


    public function editAll($student_id)
    {
        $student = Student::with('schoolClass')->findOrFail($student_id);

        $studentFees = StudentFee::with(['classFee.fee', 'payments'])
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
            $student = Student::with('schoolClass')->findOrFail($student_id);

            // Parent record
            $studentFeeParent = StudentFee::firstOrCreate(
                ['student_id' => $student_id],
                ['total_paid' => 0, 'last_payment_date' => now()]
            );

            // পুরানো পেমেন্ট মুছে দেই
            $studentFeeParent->payments()->delete();

            $totalPaid = 0;

            // ✅ Tuition Months
            if (!empty($request->tuition_months)) {
                $classFee = ClassFee::where('class_id', $student->school_class_id)
                    ->whereHas('fee', fn($q) => $q->where('type', 'recurring'))
                    ->first();

                foreach ($request->tuition_months as $month) {
                    $studentFeeParent->payments()->create([
                        'class_fee_id' => $classFee->id,
                        'type' => 'tuition',
                        'month' => $month,
                        'payment_date' => now(),
                        'paid_amount' => $classFee->amount,
                        'payment_method' => $request->payment_method,
                    ]);
                    $totalPaid += $classFee->amount;
                }
            }

            // ✅ Admission Fee
            if ($request->admission) {
                $classFee = ClassFee::where('class_id', $student->school_class_id)
                    ->whereHas('fee', fn($q) => $q->where('type', 'one_time'))
                    ->first();

                $studentFeeParent->payments()->create([
                    'class_fee_id' => $classFee->id,
                    'type' => 'admission',
                    'month' => null,
                    'payment_date' => now(),
                    'paid_amount' => $classFee->amount,
                    'payment_method' => $request->payment_method,
                ]);
                $totalPaid += $classFee->amount;
            }

            // ✅ Exam Fees
            if (!empty($request->exams)) {
                foreach ($request->exams as $feeId) {
                    $classFee = ClassFee::where('class_id', $student->school_class_id)
                        ->where('id', $feeId) // <-- change here
                        ->first();

                    if (!$classFee) continue;

                    $alreadyPaid = $studentFeeParent->payments()
                        ->where('class_fee_id', $classFee->id)
                        ->where('type', 'exam')
                        ->exists();

                    if ($alreadyPaid) continue;

                    $studentFeeParent->payments()->create([
                        'class_fee_id' => $classFee->id,
                        'type' => 'exam',
                        'month' => $classFee->fee->name,
                        'payment_date' => now(),
                        'paid_amount' => $classFee->amount,
                        'payment_method' => $request->payment_method,
                    ]);
                    $totalPaid += $classFee->amount;
                }
            }

            // ✅ Update parent
            $studentFeeParent->update([
                'total_paid' => $totalPaid,
                'last_payment_date' => now(),
            ]);

            DB::commit();
            return back()->with('success', 'Fees updated successfully!');
        } catch (\Exception $e) {
            DB::rollBack();
            dd("Error", $e->getMessage(), $e->getTraceAsString());
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
