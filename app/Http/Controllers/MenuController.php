<?php

namespace App\Http\Controllers;

use App\Models\Menu;
use App\Http\Requests\StoreMenuRequest;
use App\Http\Requests\UpdateMenuRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class MenuController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:menu-list|menu-create|menu-edit|menu-delete', ['only' => ['index', 'store']]);
        $this->middleware('permission:menu-create', ['only' => ['create', 'store']]);
        $this->middleware('permission:menu-edit', ['only' => ['edit', 'update']]);
        $this->middleware('permission:menu-delete', ['only' => ['destroy']]);
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $menus = Menu::all();
        return Inertia::render('Menu/ViewMenu', ['menus' => $menus]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Menu/CreateMenu');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store( $request)
    {
         // Manually create the validator instance
         $validator = Validator::make($request->all(), [
            'category' => ['required', 'string', 'max:255', 'unique:menus'],
        ], [
            'category.required' => 'Category Name is required.',
            'category.unique' => 'Category Name already exists.',
        ]);

        // Check if validation fails
        if ($validator->fails()) {
            // Return with validation errors
            return redirect()->back()->withErrors($validator)->withInput();
        }

        // Check if the user is authenticated
        $user = Auth::user();
        if (!$user) {
            return redirect()->back()->withErrors(['user_name' => 'User is not authenticated.'])->withInput();
        }

        // Get the authenticated user's name
        $userName = $user->name;

        // Prepare the data for the new category
        $categoryData = $request->only(['category']); // Get only the category_name
        $categoryData['user_name'] = $userName; // Add authenticated user's name as user_name

        // Attempt to insert the new category into the database
        try {
            Menu::create($categoryData);
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Error creating category: ' . $e->getMessage()]);
        }

        // Redirect to the categories index with a success message
        return redirect()->route('categories.index')->with('success', 'Category created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Menu $menu)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Menu $menu)
    {
        return Inertia::render('Menu/EditMenu', ['category' => $menu]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update( $request, Menu $menu)
    {
        $validator = Validator::make($request->all(), [
            'category' => ['required', 'string', 'max:255', 'unique:categories,category,' . $menu->id], // 
        ], [
            'category.required' => 'Category Name is required.',
            'category.unique' => 'Category Name already exists.',
        ]);

        // Check if validation fails
        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        $userName = Auth::user() ? Auth::user()->name : 'Unknown User';

        $categoryData = $request->only(['category_name']); 

        $categoryData['user_name'] = $userName;

        // Update the category in the database
        $menu->update($categoryData);

        // Redirect to the categories index with a success message
        return redirect()->route('categories.index')->with('success', 'Category updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Menu $menu)
    {
        $menu->delete();

        return redirect()->route('categories.index')->with('success', 'Category deleted successfully.');
    }
}
