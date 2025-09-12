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
        $request->validate([
            'fees' => 'required|array',
            'fees.*.fee_id' => 'required|exists:fees,id',
            'fees.*.paid_amount' => 'required|numeric|min:0',
            'fees.*.payment_method' => 'required|string|in:Cash,Bkash,Bank',
            'fees.*.months' => 'nullable|array',
        ]);

        DB::beginTransaction();

        try {
            $student = Student::with('schoolClass')->findOrFail($student_id);

            foreach ($request->fees as $feeData) {
                // ClassFee find
                $classFee = ClassFee::where('class_id', $student->school_class_id)
                    ->where('fee_id', $feeData['fee_id'])
                    ->first();

                if (!$classFee) continue;

                // Parent record
                $studentFee = StudentFee::firstOrCreate(
                    ['student_id' => $student_id, 'class_fee_id' => $classFee->id],
                    ['total_paid' => 0, 'last_payment_date' => now()]
                );

                // Delete old payments
                $studentFee->payments()->delete();

                // Insert new payments
                $months = $feeData['months'] ?? [null]; // tuition/exam/admission

                foreach ($months as $month) {
                    $studentFee->payments()->create([
                        'student_fee_id' => $studentFee->id,
                        'class_fee_id' => $classFee->id,
                        'type' => $classFee->fee->type ?? 'other',
                        'month' => $month,
                        'paid_amount' => $feeData['paid_amount'],
                        'payment_method' => $feeData['payment_method'],
                        'payment_date' => now(),
                    ]);
                }

                // Update parent totals
                $studentFee->update([
                    'total_paid' => $studentFee->payments()->sum('paid_amount'),
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
