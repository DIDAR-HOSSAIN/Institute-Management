<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:category-list|category-create|category-edit|category-delete', ['only' => ['index', 'store']]);
        $this->middleware('permission:category-create', ['only' => ['create', 'store']]);
        $this->middleware('permission:category-edit', ['only' => ['edit', 'update']]);
        $this->middleware('permission:category-delete', ['only' => ['destroy']]);
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $categories = Category::all();
        return Inertia::render('Category/ViewCategory', ['categories' => $categories]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Category/CreateCategory');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCategoryRequest $request)
    {
        // Manually create the validator instance
        $validator = Validator::make($request->all(), [
            'category_name' => ['required', 'string', 'max:255', 'unique:categories'],
        ], [
            'category_name.required' => 'Category Name is required.',
            'category_name.unique' => 'Category Name already exists.',
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
        $categoryData = $request->only(['category_name']); // Get only the category_name
        $categoryData['user_name'] = $userName; // Add authenticated user's name as user_name

        // Attempt to insert the new category into the database
        try {
            Category::create($categoryData);
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Error creating category: ' . $e->getMessage()]);
        }

        // Redirect to the categories index with a success message
        return redirect()->route('categories.index')->with('success', 'Category created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Category $category)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Category $category)
    {
        return Inertia::render('Category/EditCategory', ['category' => $category]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCategoryRequest $request, Category $category)
    {
        $validator = Validator::make($request->all(), [
            'category_name' => ['required', 'string', 'max:255', 'unique:categories,category_name,' . $category->id], // 
        ], [
            'category_name.required' => 'Category Name is required.',
            'category_name.unique' => 'Category Name already exists.',
        ]);

        // Check if validation fails
        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        $userName = Auth::user() ? Auth::user()->name : 'Unknown User';

        $categoryData = $request->only(['category_name']); 

        $categoryData['user_name'] = $userName;

        // Update the category in the database
        $category->update($categoryData);

        // Redirect to the categories index with a success message
        return redirect()->route('categories.index')->with('success', 'Category updated successfully.');       
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category)
    {
        $category->delete();

        return redirect()->route('categories.index')->with('success', 'Category deleted successfully.');
    }
}
