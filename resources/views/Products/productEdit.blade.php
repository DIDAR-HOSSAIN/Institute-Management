
<div class="py-8">
    <h1 class="text-2xl font-bold text-gray-800 mb-6">Update Product</h1>
    @if(session('error'))
        <div class="mb-4 text-red-500">
            {{ session('error') }}
        </div>
    @endif

    <form action="{{ route('products.update', $product->id) }}" method="POST" enctype="multipart/form-data" class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        @csrf
        @method('PUT')

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {{-- Product Name --}}
            <div>
                <label for="product_name" class="block text-gray-700 font-bold mb-2">Product Name</label>
                <input type="text" id="product_name" name="product_name" value="{{ old('product_name', $product->product_name) }}" required
                       class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                @error('product_name') <span class="text-red-500 text-xs mt-1">{{ $message }}</span> @enderror
            </div>

            {{-- SKU --}}
            <div>
                <label for="sku" class="block text-gray-700 font-bold mb-2">SKU</label>
                <input type="text" id="sku" name="sku" value="{{ old('sku', $product->sku) }}"
                       class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline uppercase" />
                @error('sku') <span class="text-red-500 text-xs mt-1">{{ $message }}</span> @enderror
            </div>

            {{-- Purchase Date --}}
            {{-- <div>
                <label for="purchase_date" class="block text-gray-700 font-bold mb-2">Purchase Date</label>
                <input type="date" id="purchase_date" name="purchase_date" value="{{ old('purchase_date', $product->purchase_date ? $product->purchase_date->format('Y-m-d') : '') }}"
                       class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                @error('purchase_date') <span class="text-red-500 text-xs mt-1">{{ $message }}</span> @enderror
            </div> --}}

            {{-- Supplier Name --}}
            <div>
                <label for="supplier_name" class="block text-gray-700 font-bold mb-2">Supplier Name</label>
                <input type="text" id="supplier_name" name="supplier_name" value="{{ old('supplier_name', $product->supplier_name) }}" required
                       class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline uppercase" />
                @error('supplier_name') <span class="text-red-500 text-xs mt-1">{{ $message }}</span> @enderror
            </div>

            {{-- Stock In --}}
            <div>
                <label for="stock_in" class="block text-gray-700 font-bold mb-2">Stock In</label>
                <input type="number" id="stock_in" name="stock_in" value="{{ old('stock_in', $product->stock_in) }}"
                       class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                @error('stock_in') <span class="text-red-500 text-xs mt-1">{{ $message }}</span> @enderror
            </div>

            {{-- Stock Out --}}
            <div>
                <label for="stock_out" class="block text-gray-700 font-bold mb-2">Stock Out</label>
                <input type="number" id="stock_out" name="stock_out" value="{{ old('stock_out', $product->stock_out) }}"
                       class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                @error('stock_out') <span class="text-red-500 text-xs mt-1">{{ $message }}</span> @enderror
            </div>

            {{-- Images --}}
            @foreach(['image1', 'image2', 'image3'] as $image)
                <div>
                    <label for="{{ $image }}" class="block text-gray-700 font-bold mb-2">{{ ucfirst($image) }}</label>
                    <input type="file" name="{{ $image }}" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                    @error($image) <span class="text-red-500 text-xs mt-1">{{ $message }}</span> @enderror
                    @if ($product->$image)
                        <img src="{{ asset('storage/' . $product->$image) }}" alt="Current {{ ucfirst($image) }}" class="mt-2 h-20 w-20 object-cover">
                    @endif
                </div>
            @endforeach

            {{-- Description --}}
            <div class="col-span-2">
                <label for="description" class="block text-gray-700 font-bold mb-2">Description</label>
                <textarea id="description" name="description" rows="3" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">{{ old('description', $product->description) }}</textarea>
                @error('description') <span class="text-red-500 text-xs mt-1">{{ $message }}</span> @enderror
            </div>

            {{-- Specification --}}
            <div class="col-span-2">
                <label for="specification" class="block text-gray-700 font-bold mb-2">Specification</label>
                <textarea id="specification" name="specification" rows="3" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">{{ old('specification', $product->specification) }}</textarea>
                @error('specification') <span class="text-red-500 text-xs mt-1">{{ $message }}</span> @enderror
            </div>

            {{-- Contact No --}}
            <div>
                <label for="contact_no" class="block text-gray-700 font-bold mb-2">Contact No</label>
                <input type="number" id="contact_no" name="contact_no" value="{{ old('contact_no', $product->contact_no) }}" required
                       class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                @error('contact_no') <span class="text-red-500 text-xs mt-1">{{ $message }}</span> @enderror
            </div>

            {{-- Price, Discount, Paid, Due, Total --}}
            @php
                $fields = [
                    'price' => 'Price',
                    'discount' => 'Discount',
                    'paid' => 'Paid',
                    'due' => 'Due',
                    'total' => 'Total'
                ];
            @endphp

            @foreach($fields as $field => $label)
                <div>
                    <label for="{{ $field }}" class="block text-gray-700 font-bold mb-2">{{ $label }}</label>
                    <input type="number" id="{{ $field }}" name="{{ $field }}" value="{{ old($field, $product->$field) }}" 
                           class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                           {{ $field === 'price' ? 'required' : '' }} />
                    @error($field) <span class="text-red-500 text-xs mt-1">{{ $message }}</span> @enderror
                </div>
            @endforeach
        </div>

        <div class="mt-6 text-right">
            <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Update Product
            </button>
        </div>
    </form>
</div>

