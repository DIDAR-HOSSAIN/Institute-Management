<?php

namespace App\Http\Controllers;

use App\Models\Slider;
use App\Http\Requests\StoreSliderRequest;
use App\Http\Requests\UpdateSliderRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\ImageManager;

class SliderController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:slider-list|slider-create|slider-edit|slider-delete', ['only' => ['index', 'store']]);
        $this->middleware('permission:slider-create', ['only' => ['create', 'store']]);
        $this->middleware('permission:slider-edit', ['only' => ['edit', 'update']]);
        $this->middleware('permission:slider-delete', ['only' => ['destroy']]);
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');

        $query = Slider::query();

        if ($startDate && $endDate) {
            // Make sure to convert the string dates to DateTime objects
            $startDate = \Carbon\Carbon::createFromFormat('Y-m-d', $startDate)->startOfDay();
            $endDate = \Carbon\Carbon::createFromFormat('Y-m-d', $endDate)->endOfDay();

            $query->whereBetween('created_at', [$startDate, $endDate]);
        }

        $sliders = $query->orderBy('id', 'desc')->latest()->get();


        return Inertia::render('Slider/ViewSlider', ['sliders' => $sliders]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Slider/CreateSlider');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSliderRequest $request)
    {
        $data = $request->all();

        if ($user = Auth::user()) {
            // Access user properties safely
            $data['user_name'] = $user->name;
        } else {
            // Handle the case where there is no authenticated user
            // For example, you could set a default value or throw an exception
            throw new \Exception('User not authenticated');
        }

        $imagePath = public_path('images/slider/');

        // Check if the directory exists, if not, create it
        if (!File::exists($imagePath)) {
            File::makeDirectory($imagePath, 0755, true);
        }

        // Initialize ImageManager without specifying the driver
        $manager = new ImageManager(new Driver());

        // Handle image1
        if ($request->hasFile('image')) {
            $name_gen = hexdec(uniqid()) . '.' . $request->file('image')->getClientOriginalExtension();
            $img = $manager->read($request->file('image')->getRealPath())->resize(300, 300);
            $img->save($imagePath . $name_gen, 80);
            $data['image'] = $name_gen;
        }

        // Create the new post in the database
        Slider::create($data);

        return redirect()->route('sliders.index')->with('success', 'Slider created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Slider $slider)
    {
        return Inertia::render('Slider/SliderShow', ['slider' => $slider]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Slider $slider)
    {
        return Inertia::render('Slider/EditSlider', [
            'slider' => $slider
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSliderRequest $request, Slider $slider)
    {
        $validatedData = $request->validate([
            'slider_name' => 'nullable|string|max:255',
            'status' => 'nullable|in:0,1',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Update slider fields
        $slider->slider_name = $validatedData['slider_name'] ?? $slider->slider_name;
        $slider->status = $validatedData['status'] ?? $slider->status;

        // Handle image update
        if ($request->hasFile('image')) {
            $imagePath = public_path('images/slider/');

            // Ensure directory exists
            if (!File::exists($imagePath)) {
                File::makeDirectory($imagePath, 0755, true);
            }

            // Delete old image
            if ($slider->image && file_exists($imagePath . $slider->image)) {
                unlink($imagePath . $slider->image);
            }

            // Save new image
            $imageName = time() . '_' . uniqid() . '.' . $request->file('image')->getClientOriginalExtension();
            $request->file('image')->move($imagePath, $imageName);

            $slider->image = $imageName;
        }

        $slider->save();

        return response()->json(['success' => true, 'message' => 'Slider updated successfully!', 'slider' => $slider]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Slider $slider)
    {
        $slider->delete();

        return redirect()->route('sliders.index')
        ->with('success', 'Slider deleted successfully');
    }
}
