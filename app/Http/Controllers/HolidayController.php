<?php

namespace App\Http\Controllers;

use App\Models\Holiday;
use App\Http\Requests\StoreHolidayRequest;
use App\Http\Requests\UpdateHolidayRequest;
use Inertia\Inertia;

class HolidayController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Institute-Managements/Holidays/ViewHolidays', [
            'holidays' => Holiday::orderBy('date', 'desc')->get(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Institute-Managements/Holidays/CreateHoliday');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreHolidayRequest $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'date'  => 'required|date|unique:holidays,date',
        ]);

        Holiday::create($data);
        return redirect()->route('holidays.index')->with('success', 'Holiday added.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Holiday $holiday)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Holiday $holiday)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateHolidayRequest $request, Holiday $holiday)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Holiday $holiday)
    {
        $holiday->delete();
        return redirect()->back()->with('success', 'Holiday removed.');
    }
}
