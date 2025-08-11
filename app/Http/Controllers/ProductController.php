<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Models\Category;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Inertia\Inertia;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\ImageManager;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class ProductController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:product-list|product-create|product-edit|product-delete', ['only' => ['index', 'store']]);
        $this->middleware('permission:product-create', ['only' => ['create', 'store']]);
        $this->middleware('permission:product-edit', ['only' => ['edit', 'update']]);
        $this->middleware('permission:product-delete', ['only' => ['destroy']]);
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');

        $query = Product::query();

        if ($startDate && $endDate) {
            // Make sure to convert the string dates to DateTime objects
            $startDate = \Carbon\Carbon::createFromFormat('Y-m-d', $startDate)->startOfDay();
            $endDate = \Carbon\Carbon::createFromFormat('Y-m-d', $endDate)->endOfDay();

            $query->whereBetween('entry_date', [$startDate, $endDate]);
        }

        $products = $query->orderBy('id', 'desc')->latest()->get();

        return Inertia::render('Product/ViewProduct', ['products' => $products]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $categories = Category::with('products')->get();
        return Inertia::render('Product/CreateProduct', ['categories' => $categories, 'message' => session('message'),]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProductRequest $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'product_name' => 'required|string|max:255',
                'category_name' => 'required|string|max:255',
                // 'sku' => 'nullable|string',
                'purchase_date' => 'nullable|date',
                'supplier_name' => 'nullable|string|max:255',
                'description' => 'required|string|max:1000',
                // 'slug' => 'nullable|string|max:255|unique:products,slug',
                'image1' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
                'image2' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
                'image3' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
                'image4' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
                'image5' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
                'stock_in' => 'nullable|integer|min:0',
                'stock_out' => 'nullable|integer|min:0',
                'purchase_price' => 'required|numeric|min:0',
                'sales_price' => 'required|numeric|min:0',
                'previous_price' => 'required|numeric|min:0',
                'profit' => 'nullable|numeric',
            ]);

            if ($validator->fails()) {
                return redirect()->back()
                    ->withErrors($validator)
                    ->withInput();
            }

            $data = $request->all();
            $data['product_id'] = $this->generateProductId();

            if ($user = Auth::user()) {
                $data['user_name'] = $user->name;
            } else {
                return redirect()->back()->with('error', 'User not authenticated');
            }

            $category = Category::where('category_name', $data['category_name'])->first();

            if (!$category) {
                return redirect()->back()->withErrors(['error' => 'Invalid category selected.']);
            }

            $data['category_id'] = $category->id;

            $imagePath = 'images/products/';
            $fullImagePath = public_path($imagePath);

            if (!File::exists($fullImagePath)) {
                File::makeDirectory($fullImagePath, 0755, true);
            }

            $manager = new ImageManager(new Driver());
            $imageFields = ['image1', 'image2', 'image3', 'image4', 'image5'];

            foreach ($imageFields as $field) {
                if ($request->hasFile($field)) {
                    $image = $request->file($field);
                    $name_gen = hexdec(uniqid()) . '.' . $image->getClientOriginalExtension();
                    $img = $manager->read($image->getRealPath())->resize(300, 300);
                    $img->save($fullImagePath . $name_gen, 80);
                    $data[$field] = $name_gen;
                }
            }

            Product::create($data);

            return redirect()->route('products.create')
                ->with('message', 'Product Added successfully!');
        } catch (Exception $e) {
            return redirect()->back()
                ->withErrors(['error' => 'Product Added failed. Please try again.'])
                ->withInput();
        }
    }


    private function generateProductId()
    {
        $prefix = 'BF';
        $currentDate = now()->format('ymd');

        // Loop until a unique patient_id is generated
        do {
            // Get the maximum patient_id for the current date
            $latestPatientId = DB::table('products')
                ->where('product_id', 'like', "BF-$currentDate-%")
                ->max('product_id');

            // If there are existing records for the current date, extract the serial number and increment
            $serialNumber = $latestPatientId ? intval(substr($latestPatientId, -3)) + 1 : 1;

            // Format the serial number with leading zeros
            $serialNumberFormatted = str_pad($serialNumber, 3, '0', STR_PAD_LEFT);

            // Generate the new product_id
            $newPatientId = $prefix . '-' . $currentDate . '-' . $serialNumberFormatted;
        } while (Product::where('product_id', $newPatientId)->exists());

        return $newPatientId;
    }


    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        return Inertia::render('Product/ShowProduct', ['product' => $product]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        $categories = Category::with('products')->get();
        return Inertia::render('Product/EditProduct', ['product' => $product, 'categories' => $categories, 'message' => session('message'),]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProductRequest $request, $id)
    {
        try {
            // Validate incoming data
            $validatedData = $request->validate([
                'product_name' => 'nullable|string|max:100',
                'category_name' => 'nullable|string|max:100',
                // 'sku' => 'nullable|string',
                'purchase_date' => 'nullable|date',
                'supplier_name' => 'nullable|string|max:100',
                'description' => 'nullable|string|max:1000',
                // 'slug' => 'nullable|string|max:255|unique:products,slug,' . $id->id,
                'image1' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
                'image2' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
                'image3' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
                'image4' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
                'image5' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
                'stock_in' => 'nullable|integer|min:0',
                'stock_out' => 'nullable|integer|min:0',
                'purchase_price' => 'required|numeric|min:0',
                'sales_price' => 'required|numeric|min:0',
                'previous_price' => 'nullable',
                'profit' => 'nullable|numeric',
            ]);

            $product = Product::findOrFail($id);

            $product->product_name = $validatedData['product_name'] ?? $product->product_name;
            $product->category_name = $validatedData['category_name'] ?? $product->category_name;
            // $product->sku = $validatedData['sku'] ?? $product->sku;
            $product->purchase_date = $validatedData['purchase_date'] ?? $product->purchase_date;
            $product->supplier_name = $validatedData['supplier_name'] ?? $product->supplier_name;
            // $product->slug = $validatedData['slug'] ?? $product->slug;
            $product->description = $validatedData['description'] ?? $product->description;
            $product->stock_in = $validatedData['stock_in'] ?? $product->stock_in;
            $product->stock_out = $validatedData['stock_out'] ?? $product->stock_out;
            $product->purchase_price = $validatedData['purchase_price'] ?? $product->purchase_price;
            $product->sales_price = $validatedData['sales_price'] ?? $product->sales_price;
            $product->previous_price = $validatedData['previous_price'] ?? $product->previous_price;
            $product->profit = $validatedData['profit'] ?? $product->profit;

            // Handle image updates
            $imagePath = public_path('images/products/');

            if (!File::exists($imagePath)) {
                File::makeDirectory($imagePath, 0755, true);
            }

            // Array of image fields
            $imageFields = ['image1', 'image2', 'image3', 'image4', 'image5']; // Add all image field names here

            foreach ($imageFields as $field) {
                if ($request->hasFile($field)) {
                    // Delete existing image if present
                    if ($product->$field && file_exists($imagePath . $product->$field)) {
                        unlink($imagePath . $product->$field);
                    }

                    // Save the new image
                    $imageName = time() . '_' . uniqid() . '.' . $request->file($field)->getClientOriginalExtension();
                    $request->file($field)->move($imagePath, $imageName);

                    // Assign the new image name to the product field
                    $product->$field = $imageName;
                }
            }


            $product->save();

            return response()->json(['message' => 'Product updated successfully!']);
        } catch (Exception $e) {
            return response()->json([
                'error' => 'Product update failed!',
                'message' => $e->getMessage(),
            ], 422);
        }

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        try {
            $imagePath = public_path('images/products/');
            $imageFields = ['image1', 'image2', 'image3', 'image4', 'image5'];
    
            // Delete all associated images
            foreach ($imageFields as $field) {
                if ($product->$field && File::exists($imagePath . $product->$field)) {
                    File::delete($imagePath . $product->$field);
                }
            }
    
            // Delete the product
            $product->delete();
    
            return redirect()->back()->with('success', 'Product deleted successfully!');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to delete the product: ' . $e->getMessage());
        }
    }

    // Controller method to fetch products
    public function getProducts($id)
    {
        try {
            $product = Product::findOrFail($id);
            // return response()->json($product);
            return Inertia::render('Product/ProductDetails', ['product' => $product]);
        } catch (\Exception $e) {
            Log::error('Error fetching product: ' . $e->getMessage());
            return response()->json(['error' => 'Product not found'], 404);
        }
    }
}
