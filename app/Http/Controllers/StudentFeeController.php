<?php

namespace App\Http\Controllers;

use App\Models\StudentFee;
use App\Http\Requests\StoreStudentFeeRequest;
use App\Http\Requests\UpdateStudentFeeRequest;
use App\Models\ClassFee;
use App\Models\Fee;
use App\Models\Student;
use App\Models\StudentFeePayment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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

        $fees = ClassFee::with('fee')
            ->where('class_id', $student->school_class_id)
            ->get();

        return Inertia::render('Institute-Managements/StudentFee/CreateStudentFee', [
            'student' => $student,
            'fees' => $fees,
        ]);
    }





    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $student = Student::findOrFail($request->student_id);

        foreach ($request->payments as $payment) {
            $classFee = ClassFee::with('fee')
                ->where('class_id', $student->school_class_id)
                ->where('fee_id', $payment['fee_id'])
                ->first();

            if (!$classFee) continue;

            // One-time or recurring fee
            $studentFee = StudentFee::firstOrCreate([
                'student_id' => $student->id,
                'class_fee_id' => $classFee->id,
            ], [
                'total_paid' => 0,
                'months' => [],
                'payment_method' => $payment['method'] ?? 'Cash',
                'last_payment_date' => now(),
            ]);

            // Handle recurring fee months
            $months = $studentFee->months ?? [];
            if (!empty($payment['month']) && !in_array($payment['month'], $months)) {
                $months[] = $payment['month'];
            }

            // Check for one-time fee (Admission)
            if ($classFee->fee->type === 'one_time') {
                // Only add if not already paid
                if (!StudentFeePayment::where('student_fee_id', $studentFee->id)->exists()) {
                    StudentFeePayment::create([
                        'student_fee_id' => $studentFee->id,
                        'paid_amount' => $payment['amount'],
                        'payment_method' => $payment['method'] ?? 'Cash',
                        'month' => null,
                        'payment_date' => now(),
                    ]);
                }
            } else {
                // Recurring fee: prevent duplicate month
                if (empty($payment['month']) || !StudentFeePayment::where('student_fee_id', $studentFee->id)
                    ->where('month', $payment['month'])->exists()) {
                    StudentFeePayment::create([
                        'student_fee_id' => $studentFee->id,
                        'paid_amount' => $payment['amount'],
                        'payment_method' => $payment['method'] ?? 'Cash',
                        'month' => $payment['month'] ?? null,
                        'payment_date' => now(),
                    ]);
                }
            }

            // Update student_fee total_paid from student_fee_payments table
            $studentFee->update([
                'total_paid' => StudentFeePayment::where('student_fee_id', $studentFee->id)->sum('paid_amount'),
                'months' => $months,
                'payment_method' => $payment['method'] ?? 'Cash',
                'last_payment_date' => now(),
            ]);
        }

        return back()->with('success', 'Fees recorded successfully!');
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
}
