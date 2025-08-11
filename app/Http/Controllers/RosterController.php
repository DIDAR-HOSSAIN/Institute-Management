<?php

namespace App\Http\Controllers;

use App\Models\Roster;
use App\Http\Requests\StoreRosterRequest;
use App\Http\Requests\UpdateRosterRequest;
use Inertia\Inertia;

class RosterController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $rosters = Roster::all();
        return Inertia::render('Payroll/Roster/ViewRoster', ['rosters' => $rosters]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Payroll/Roster/CreateRoster');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRosterRequest $request)
    {
        $request->validate([
            'office_start' => 'required|date_format:H:i',
            'office_end' => 'required|date_format:H:i|after:office_start',
        ]);

        Roster::create($request->only('office_start', 'office_end'));

        return redirect()->route('rosters.index')->with('success', 'Roster created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Roster $roster)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Roster $roster)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRosterRequest $request, Roster $roster)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Roster $roster)
    {
        $roster->delete();
        return redirect()->back()->with('success', 'Roster deleted.');
    }
}
