<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreOrderRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            // 'customer_name' => 'required|string|max:255',
            // 'shipping_address' => 'required|string|max:255',
            // 'contact_no' => 'required|string|max:15',
            // 'total_price' => 'required|numeric',
            // 'cartItems' => 'required|array',
            // 'cartItems.*.id' => 'nullable|integer|exists:order_items,id',
            // 'cartItems.*.product_id' => 'required|integer|exists:products,id',
            // 'cartItems.*.product_name' => 'required|string|max:255',
            // 'cartItems.*.unit_price' => 'required|numeric',
            // 'cartItems.*.quantity' => 'required|integer|min:1',
            // 'cartItems.*.subtotal' => 'required|numeric',
        ];
    }
}
