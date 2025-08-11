<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Http\Requests\StoreOrderRequest;
use App\Http\Requests\UpdateOrderRequest;
use App\Models\OrderItem;
use App\Models\Product;
use Carbon\Carbon;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class OrderController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:order-list|order-edit|order-delete', ['only' => ['index']]);
        $this->middleware('permission:order-edit', ['only' => ['edit', 'update']]);
        $this->middleware('permission:order-delete', ['only' => ['destroy']]);
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');

        $query = Order::query();

        if ($startDate && $endDate) {
            // Make sure to convert the string dates to DateTime objects
            $startDate = \Carbon\Carbon::createFromFormat('Y-m-d', $startDate)->startOfDay();
            $endDate = \Carbon\Carbon::createFromFormat('Y-m-d', $endDate)->endOfDay();

            $query->whereBetween('order_date', [$startDate, $endDate]);
        }

        // Eager load the orderItems relationship
        $orders = $query->with('orderItems')
            ->orderBy('id', 'desc')
            ->latest()
            ->get();

        return Inertia::render('Order/ViewList', ['orders' => $orders]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Order/OrderCreate');
    }

    /**
     * Store a newly created resource in storage.
     */

    public function store(StoreOrderRequest $request)
    {
        DB::beginTransaction(); // Start a database transaction
        try {
            $validator = Validator::make($request->all(), [
                'customer_name' => 'required|string|max:255',
                'shipping_address' => 'required|string|max:500',
                'contact_no' => 'required|string|max:15',
                'shipping_charge' => 'required|numeric|in:100,150',
                'total_price' => 'required|numeric|min:0',
                'cartItems' => 'required|array|min:1',
                'cartItems.*.product_id' => 'required|string|exists:products,product_id',
                'cartItems.*.product_name' => 'required|string|max:255',
                'cartItems.*.product_size' => 'required|string|max:100',
                'cartItems.*.quantity' => 'required|integer|min:1',
                'cartItems.*.product_image' => 'nullable|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'error' => true,
                    'message' => 'Validation errors',
                    'errors' => $validator->errors(),
                ], 422);
            }

            $validatedData = $validator->validated();

            
            // Generate a unique order ID
            $orderId = $this->generateOrderId();
            
            $orderDate = Carbon::now()->format('Y-m-d');

            // Create the order record
            $order = Order::create([
                'order_id' => $orderId,
                'customer_name' => $validatedData['customer_name'],
                'shipping_address' => $validatedData['shipping_address'],
                'contact_no' => $validatedData['contact_no'],
                'shipping_charge' => $validatedData['shipping_charge'],
                'total_price' => $validatedData['total_price'],
                'order_date' => $orderDate,
            ]);

            // Process each cart item
            foreach ($validatedData['cartItems'] as $item) {
                $product = Product::where('product_id', $item['product_id'])->firstOrFail();

                // Create OrderItem record
                OrderItem::create([
                    'order_id' => $order->order_id,
                    'product_id' => $item['product_id'],
                    'product_name' => $product->product_name,
                    'product_size' => $item['product_size'] ?? 'Not selected',
                    'product_image' => $product->image1,
                    'unit_price' => $product->sales_price,
                    'quantity' => $item['quantity'],
                    'subtotal' => $product->sales_price * $item['quantity'],
                ]);
            }

            DB::commit(); 

            return response()->json([
                'order_id' => $order->order_id,
                'message' => 'Order placed successfully!',
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();

            // Log the error for debugging
            Log::error('Order Failed', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'error' => true,
                'message' => 'Order Failed!',
                'details' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Generate a unique order ID.
     *
     * @return string
     */
    private function generateOrderId()
    {
        $prefix = 'OID';
        $currentDate = now()->format('ymd');
        $serialNumber = 1;

        $latestOrder = DB::table('orders')
            ->where('order_id', 'like', "$prefix-$currentDate-%")
            ->latest('order_id')
            ->first();

        if ($latestOrder) {
            $serialNumber = intval(substr($latestOrder->order_id, -3)) + 1;
        }

        $serialNumberFormatted = str_pad($serialNumber, 3, '0', STR_PAD_LEFT);
        return "$prefix-$currentDate-$serialNumberFormatted";
    }


    /**
     * Display the specified resource.
     */
    public function show(Order $order)
    {
        $order->load('orderItems');
        return Inertia::render('Order/ShowOrder', ['order' => $order]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Order $order)
    {
        // Fetch the order with its related items and product details
        $orderDetails = Order::with('orderItems.product')->find($order->id);

        if (!$orderDetails) {
            // Handle the case where the order is not found
            return redirect()->route('orders.index')->withErrors(['Order not found.']);
        }

        return Inertia::render('Order/EditOrder', ['orderDetails' => $orderDetails]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateOrderRequest $request, Order $order)
    {
        // Validate request data for orders table
        $validatedOrderData = $request->validate([
            'customer_name' => 'required|string',
            'shipping_address' => 'required|string',
            'contact_no' => 'required|string',
            'total_price' => 'required|numeric',
        ]);

        // Check if the current version matches the provided version
        if ($order->version != $request->input('version')) {
            return response()->json(['error' => 'Conflict', 'message' => 'Resource has been updated by another user. Please refresh and try again.'], 409);
        }

        // Update the order attributes in orders table
        $order->customer_name = $validatedOrderData['customer_name'];
        $order->shipping_address = $validatedOrderData['shipping_address'];
        $order->contact_no = $validatedOrderData['contact_no'];
        $order->total_price = $validatedOrderData['total_price'];

        // Save the updated order
        $order->save();

        // Handle updating order items
        if ($request->has('cartItems')) {
            foreach ($request->input('cartItems') as $itemData) {
                // Ensure the order_id exists in orders table before updating order_items
                if ($order->exists()) {
                    OrderItem::updateOrCreate(
                        ['id' => $itemData['id']], // Try to find existing item by ID or create new
                        [
                            'order_id' => $order->order_id,
                            'product_id' => $itemData['product_id'],
                            'product_image' => $itemData['product_image'],
                            'product_name' => $itemData['product_name'],
                            'serial_no' => $itemData['serial_no'],
                            'unit_price' => $itemData['unit_price'],
                            'quantity' => $itemData['quantity'],
                            'subtotal' => $itemData['unit_price'] * $itemData['quantity']
                        ]
                    );
                } else {
                    // Handle scenario where $order doesn't exist (perhaps return an error response)
                }
            }
        }

        return response()->json(['success' => 'Order updated successfully.'], 200);
    }


    /**
     * Remove the specified resource from storage.
     */
    // OrderController.php
    // In OrderController.php
    public function destroy(Order $order)
    {
        $order->orderItems()->delete();
        $order->delete();
        return redirect()->route('orders.index')->with('success', 'Order and related data deleted successfully');
    }

    public function getInvoice($orderId)
    {
        // Fetch the order with matching order_id, including related orderItems
        $invoice = Order::with('orderItems')
            ->where('order_id', $orderId)
            ->first(); // Get a single record
        // return $invoice;
        if (!$invoice) {
            // Return a 404 or any appropriate response if the order is not found
            abort(404, 'Order not found');
        }

        return Inertia::render('Order/Invoice', ['invoice' => $invoice]);
    }




    public function thanks($orderId)
    {
        // Fetch order details including related items
        $order = Order::with('orderItems')->where('order_id', $orderId)->firstOrFail();

        // Pass data to Inertia view
        return Inertia::render('Order/Thanks', [
            'orderDetails' => $order, // Passing order details to the Thanks component
        ]);
    }
}
