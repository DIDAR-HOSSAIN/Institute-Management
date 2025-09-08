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
        $studentFees = StudentFee::with(['student', 'fee'])
            ->orderBy('id', 'desc')
            ->get();

        return Inertia::render('Institute-Managements/StudentFee/ViewStudentFee', [
            'studentFees' => $studentFees,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $students = Student::select('id', 'student_name', 'roll_number')->get();
        $fees = Fee::all();

        // প্রতিটি student এর জন্য কোন মাস/টার্ম paid তা বের করা
        $paidMonths = StudentFee::all()->groupBy('student_id')->map(function ($rows) {
            return $rows->groupBy('fee_id')->map(function ($items) {
                return $items->pluck('months')->flatten()->filter()->values()->toArray();
            });
        });

        return Inertia::render('Institute-Managements/StudentFee/CreateStudentFee', [
            'students' => $students,
            'fees' => $fees,
            'paidMonths' => $paidMonths,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreStudentFeeRequest $request)
    {
        $request->validate([
            'student_id'     => 'required|exists:students,id',
            'fee_id'         => 'required|exists:fees,id',
            'paid_amount'    => 'required|numeric|min:0',
            'payment_method' => 'required|string|in:Cash,Bkash,Bank',
            'months'         => 'nullable|array',
        ]);

        $fee = Fee::findOrFail($request->fee_id);

        // ✅ One-time fee case
        if ($fee->type === 'one_time') {
            $alreadyPaid = StudentFee::where('student_id', $request->student_id)
                ->where('fee_id', $fee->id)
                ->exists();

            if ($alreadyPaid) {
                return back()->withErrors(['fee_id' => 'This one-time fee is already paid!']);
            }

            StudentFee::create([
                'student_id'     => $request->student_id,
                'fee_id'         => $fee->id,
                'paid_amount'    => $fee->amount,
                'payment_method' => $request->payment_method,
                'months'         => null,
                'payment_date'   => now(),
            ]);
        }
        // ✅ Monthly/Term fees case
        else {
            if (empty($request->months)) {
                return back()->withErrors(['months' => 'Please select at least one month or term for this fee.']);
            }

            // আগে থেকে যেসব মাস Paid আছে সেগুলো বাদ দিয়ে নেব
            $alreadyPaidMonths = StudentFee::where('student_id', $request->student_id)
                ->where('fee_id', $fee->id)
                ->pluck('months')
                ->flatten()
                ->toArray();

            $newMonths = array_diff($request->months, $alreadyPaidMonths);

            if (count($newMonths) > 0) {
                StudentFee::create([
                    'student_id'     => $request->student_id,
                    'fee_id'         => $fee->id,
                    'paid_amount'    => $fee->amount * count($newMonths), // ✅ একসাথে মোট টাকা
                    'payment_method' => $request->payment_method,
                    'months'         => $newMonths, // ✅ এক row তে সব মাস array আকারে সেভ হবে
                    'payment_date'   => now(),
                ]);
            }
        }

        return redirect()->route('student-fees.create')->with('success', 'Fee collected successfully!');
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
        $request->validate([
            'fees' => 'required|array',
            'fees.*.fee_id' => 'required|exists:fees,id',
            'fees.*.paid_amount' => 'required|numeric|min:0',
            'fees.*.payment_method' => 'required|string|in:Cash,Bkash,Bank',
            'fees.*.months' => 'nullable|array',
        ]);

        foreach ($request->fees as $feeData) {
            $fee = Fee::findOrFail($feeData['fee_id']);

            $studentFee = StudentFee::where('student_id', $student_id)
                ->where('fee_id', $fee->id)
                ->first();

            if ($studentFee) {
                // update existing fee
                $studentFee->update([
                    'paid_amount'    => $feeData['paid_amount'],
                    'payment_method' => $feeData['payment_method'],
                    'months'         => $fee->type === 'recurring' ? $feeData['months'] : null,
                    'payment_date'   => now(),
                ]);
            }
        }

        return redirect()->route('student-fees.create')->with('success', 'All fees updated successfully!');
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
