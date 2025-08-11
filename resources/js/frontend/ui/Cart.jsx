import { useContext } from "react";
import { CartContext } from "./CartContext";
import { Link } from "@inertiajs/react";
import { FaTrashAlt } from "react-icons/fa"; // Import delete icon

const Cart = ({ toggleCart }) => {
    const { cartItems, incrementQuantity, decrementQuantity, removeItem } =
        useContext(CartContext);

    const calculateSubtotal = () => {
        return cartItems
            .reduce((total, item) => {
                const price = parseFloat(item.product.sales_price);
                const quantity = parseInt(item.quantity, 10);
                // Make sure to handle the case where price or quantity might be invalid
                return (
                    total +
                    (isNaN(price) || isNaN(quantity) ? 0 : price * quantity)
                );
            }, 0)
    };

    return (
        <div className="bg-white shadow-lg absolute top-16 right-0 sm:right-4 md:right-8 lg:right-16 xl:right-20 w-full sm:w-96 lg:w-[28rem] p-4 z-20 rounded-lg overflow-y-auto max-h-[80vh]">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Shopping Cart</h2>
                <button
                    onClick={toggleCart}
                    className="text-white bg-red-600 w-6 h-6"
                >
                    &times;
                </button>
            </div>
            <ul className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                    <li
                        key={item.product.id}
                        className="flex py-4 items-center space-x-4"
                    >
                        {/* Image Section */}
                        <img
                            src={`/public/images/products/${item.product.image1}`}
                            alt={item.product.product_name}
                            className="w-16 h-16 rounded-md object-cover"
                        />

                        {/* Item Info Section */}
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold">
                                {item.product.product_name}
                            </h3>
                            <p className="text-sm text-gray-600">
                                Size:
                                {item.product_size?.map(
                                    (product_size, index) => (
                                        <span key={index} className="mr-2">
                                            {product_size}
                                        </span>
                                    )
                                ) || "None"}
                            </p>

                            <div className="flex items-center space-x-2 mt-2">
                                <button
                                    onClick={() =>
                                        incrementQuantity(item.product.id)
                                    }
                                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                                >
                                    +
                                </button>
                                <span className="text-sm text-gray-600">
                                    {item.quantity}
                                </span>
                                <button
                                    onClick={() =>
                                        decrementQuantity(item.product.id)
                                    }
                                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                >
                                    -
                                </button>
                            </div>
                        </div>

                        {/* Price and Delete Section */}
                        <div className="flex flex-col items-end">
                            <p className="text-lg font-semibold">
                                Tk
                                {(
                                    parseFloat(item.product.sales_price) *
                                    parseInt(item.quantity, 10)
                                ).toFixed(2)}
                                {/* Display individual item price */}
                            </p>
                            <p className="text-sm text-gray-600">
                                Price: Tk
                                {parseFloat(item.product.sales_price).toFixed(
                                    2
                                )}
                            </p>
                            <button
                                onClick={() => removeItem(item.product.id)}
                                className="mt-2 text-red-500 hover:text-red-700"
                            >
                                <FaTrashAlt className="w-5 h-5" />
                            </button>
                        </div>
                    </li>
                ))}
            </ul>

            {/* Total Section */}
            <div className="flex justify-between items-center mt-4">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-lg font-semibold">
                    Tk {calculateSubtotal()}
                </span>
                {/* Display the total */}
            </div>

            {/* Checkout Button */}
            <div className="mt-4">
                {cartItems.length > 0 ? (
                    <Link
                        href={route("orders.create")}
                        className="btn w-full bg-blue-500 text-white hover:bg-blue-600 py-2 rounded-lg"
                    >
                        Proceed to Checkout
                    </Link>
                ) : (
                    <button
                        disabled
                        className="btn w-full bg-gray-300 text-gray-500 cursor-not-allowed py-2 rounded-lg"
                    >
                        Proceed to Checkout
                    </button>
                )}
            </div>
        </div>
    );
};

export default Cart;
