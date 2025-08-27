<?php

namespace App\Http\Controllers;

use App\Models\Section;
use App\Http\Requests\StoreSectionRequest;
use App\Http\Requests\UpdateSectionRequest;
use App\Models\SchoolClass;
use Inertia\Inertia;

class SectionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $sections = Section::with('schoolClass')->get();
        return Inertia::render('Institute-Managements/Section/ViewSections', [
            'sections' => $sections
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $classes = SchoolClass::all();
        return Inertia::render('Institute-Managements/Section/CreateSection', [
            'classes' => $classes
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSectionRequest $request)
    {
        $request->validate([
            'section_name' => 'required|string|max:255',
            'school_class_id' => 'required|exists:school_classes,id'
        ]);

        Section::create($request->only('section_name', 'school_class_id'));

        return redirect()->route('sections.index')->with('success', 'Section created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Section $section)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Section $section)
    {
        $classes = SchoolClass::all();
        return Inertia::render('Institute-Managements/Section/EditSection', [
            'section' => $section,
            'classes' => $classes
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSectionRequest $request, Section $section)
    {
        $request->validate([
            'section_name' => 'required|string|max:255',
            'school_class_id' => 'required|exists:school_classes,id'
        ]);

        $section->update($request->only('section_name', 'school_class_id'));

        return redirect()->route('sections.index')->with('success', 'Section updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Section $section)
    {
        $section->delete();
        return redirect()->route('sections.index')->with('success', 'Section deleted');
    }
}
