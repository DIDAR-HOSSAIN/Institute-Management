<?php

namespace App\Http\Controllers;

use App\Models\ClassFee;
use App\Http\Requests\StoreClassFeeRequest;
use App\Http\Requests\UpdateClassFeeRequest;
use App\Models\Fee;
use App\Models\SchoolClass;
use Inertia\Inertia;

class ClassFeeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $classes   = SchoolClass::all();
        $fees      = Fee::all();
        $classFees = ClassFee::with(['schoolClass', 'fee'])->get();

        return Inertia::render('Institute-Managements/ClassFee/CreateClassFee', [
            'classes'   => $classes,
            'fees'      => $fees,
            'classFees' => $classFees,
        ]);
    }


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $classes = SchoolClass::with(['fees.fee'])->get();
        $fees = Fee::all();
        $classFees = ClassFee::with(['schoolClass', 'fee'])->get();

        return Inertia::render('Institute-Managements/ClassFee/CreateClassFee', [
            'classes'   => $classes,
            'fees'      => $fees,
            'classFees' => $classFees,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreClassFeeRequest $request)
    {
        $actionType = $request->input('action_type');

        if ($actionType === 'class') {
            $request->validate(['class_name' => 'required|string|max:255']);
            SchoolClass::create($request->only('class_name'));

            return redirect()->route('class-fees.index')->with('success', 'Class created successfully');
        }

        if ($actionType === 'fee') {
            $request->validate([
                'name' => 'required|string|max:255',
                'type' => 'required|string|in:one_time,recurring,exam,fee',
            ]);
            Fee::create($request->only('name', 'type'));

            return redirect()->route('class-fees.index')->with('success', 'Fee created successfully');
        }

        if ($actionType === 'class_fee') {
            $request->validate([
                'school_class_id' => 'required|exists:school_classes,id',
                'fee_id' => 'required|exists:fees,id',
                'amount' => 'required|numeric|min:0',
            ]);

            ClassFee::create($request->only('school_class_id', 'fee_id', 'amount'));

            return redirect()->route('class-fees.index')->with('success', 'Class Fee assigned successfully');
        }

        return redirect()->back()->with('error', 'Invalid action');
    }

    /**
     * Display the specified resource.
     */
    public function show(ClassFee $classFee)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ClassFee $classFee)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateClassFeeRequest $request, ClassFee $classFee)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ClassFee $classFee)
    {
        $classFee->delete();
        return redirect()->route('class-fee.index')->with('success', 'Deleted successfully');
    }
}
