import FrontendLayout from "@/frontend/Layout/FrontendLayout";
import { CartContext } from "@/frontend/ui/CartContext";
import React, { useState, useContext } from "react";
import { FaCartPlus, FaShoppingBasket } from "react-icons/fa";
import { FaPhone } from "react-icons/fa";
import { router } from "@inertiajs/react";

const ProductDetails = ({ product }) => {
    const { addToCart } = useContext(CartContext);
    const [quantity, setQuantity] = useState(1);
    const [largeImage, setLargeImage] = useState(product.image1);
    const [product_size, setProductSize] = useState([]);
    const [sizeWarning, setSizeWarning] = useState(false);

    const handleAddToCart = () => {
        if (product_size.length === 0) {
            setSizeWarning(true); // Show warning if no product_size is selected
            return;
        }

        // Add product and its selected sizes to the cart
        addToCart({ ...product, product_size }, quantity);
        setQuantity(1); // Reset quantity input
        setProductSize([]); // Reset selected sizes
        setSizeWarning(false); // Clear product_size warning
    };

    const handleOrder = () => {
        if (product_size.length === 0) {
            setSizeWarning(true); // Show warning if no product_size is selected
            return;
        }

        // Add product and its selected sizes to the cart
        addToCart({ ...product, product_size }, quantity);
        setQuantity(1); // Reset quantity input
        setProductSize([]); // Reset selected sizes
        setSizeWarning(false); // Clear product_size warning
         router.visit(route("orders.create"));
    };

    const handleSizeSelect = (size) => {
        setProductSize(
            (prevSizes) =>
                prevSizes.includes(size)
                    ? prevSizes.filter((s) => s !== size) // Deselect size if already selected
                    : [...prevSizes, size] // Add size if not already selected
        );
        setSizeWarning(false); // Clear warning on size selection
    };

    return (
        <FrontendLayout>
            <div className="mt-12 p-8 bg-white border border-gray-200 rounded-lg shadow-lg">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                        <div className="flex justify-center gap-6 mb-8">
                            <div className="w-full lg:w-96 h-96">
                                <img
                                    src={`/public/images/products/${largeImage}`}
                                    alt={`Large image of ${product.product_name}`}
                                    className="w-full h-full object-cover rounded-lg shadow-lg"
                                />
                            </div>
                        </div>

                        <div className="flex justify-center gap-4 mb-8">
                            {[
                                product.image1,
                                product.image2,
                                product.image3,
                                product.image4,
                                product.image5,
                            ].map(
                                (img, idx) =>
                                    img && (
                                        <div
                                            key={idx}
                                            className="cursor-pointer w-20 h-20"
                                            onClick={() => setLargeImage(img)}
                                        >
                                            <img
                                                src={`/public/images/products/${img}`}
                                                alt={`Thumbnail ${idx + 1}`}
                                                className="w-full h-full object-cover rounded-lg border border-gray-300 shadow-md"
                                            />
                                        </div>
                                    )
                            )}
                        </div>

                        <div className="text-lg text-gray-700">
                            <strong className="font-semibold">
                                Description:
                            </strong>
                            <ul className="list-disc pl-6 mt-2">
                                {product.description
                                    .split(/,|।/)
                                    .map((item, index) => (
                                        <li key={index} className="mb-1">
                                            {item.trim()}
                                        </li>
                                    ))}
                            </ul>
                        </div>
                    </div>

                    <div>
                        <div className="space-y-2">
                            <div className="text-lg font-semibold text-gray-900">
                                <span className="text-2xl">
                                    {product.product_name}
                                </span>
                            </div>

                            <div className="space-y-2 mt-2">
                                <p className="text-green-600 text-2xl font-semibold">
                                    {product.sales_price} Tk
                                </p>
                                <p className="font-semibold text-lg text-gray-800">
                                    Select Size:
                                </p>
                                <div className="flex flex-wrap gap-4">
                                    {[
                                        "32",
                                        "34",
                                        "36",
                                        "38",
                                        "40",
                                        "42",
                                        "44",
                                        "46",
                                        "48",
                                    ].map((size) => (
                                        <button
                                            key={size}
                                            onClick={() =>
                                                handleSizeSelect(size)
                                            }
                                            className={`cursor-pointer text-gray-700 text-xl font-semibold p-2 border border-gray-300 rounded-lg ${
                                                product_size.includes(size)
                                                    ? "bg-blue-600 text-white"
                                                    : "hover:bg-gray-200"
                                            }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>

                                {sizeWarning && (
                                    <p className="text-red-600 text-sm mt-2">
                                        Please select a size before adding to
                                        cart.
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center space-x-4">
                                <label
                                    htmlFor="quantity"
                                    className="font-semibold text-lg text-gray-800"
                                >
                                    Quantity:
                                </label>
                                <div className="flex items-center gap-2">
                                    {/* Decrement Button */}
                                    <button
                                        onClick={() =>
                                            setQuantity(
                                                quantity > 1 ? quantity - 1 : 1
                                            )
                                        }
                                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                    >
                                        -
                                    </button>

                                    {/* Quantity Input */}
                                    <input
                                        type="number"
                                        id="quantity"
                                        value={quantity}
                                        onChange={(e) => {
                                            const value = Number(
                                                e.target.value
                                            );
                                            setQuantity(value > 0 ? value : 1);
                                        }}
                                        className="w-16 text-center px-2 py-1 border border-gray-300 rounded-lg"
                                    />

                                    {/* Increment Button */}
                                    <button
                                        onClick={() =>
                                            setQuantity(quantity + 1)
                                        }
                                        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                className="flex items-center justify-center text-xl bg-green-700 text-white font-semibold py-2 px-4 rounded-lg w-full"
                            >
                                <FaCartPlus className="mr-2" /> Add to Cart
                            </button>

                            <button
                                onClick={handleOrder}
                                className="flex items-center justify-center text-xl bg-green-700 text-white font-semibold py-2 px-4 rounded-lg w-full"
                            >
                                <FaShoppingBasket className="mr-2" /> Order
                            </button>

                            <button className="flex items-center justify-center text-xl bg-green-700 text-white font-semibold py-2 px-4 rounded-lg w-full">
                                <FaPhone
                                    className="mr-2 w-6 h-6"
                                    style={{ transform: "rotate(90deg)" }}
                                />
                                +8801778862270
                            </button>

                            <button className="flex items-center justify-center text-xl bg-green-700 text-white font-semibold py-2 px-4 rounded-lg w-full">
                                <FaPhone
                                    className="mr-2 w-6 h-6"
                                    style={{ transform: "rotate(90deg)" }}
                                />
                                +8801892057595
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </FrontendLayout>
    );
};

export default ProductDetails;
