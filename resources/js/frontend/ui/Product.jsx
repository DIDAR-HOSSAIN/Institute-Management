import servicesBg from "@/assets/images/our_network_services_bg.png";
import { Link } from "@inertiajs/react";
import { GiShoppingCart } from "react-icons/gi";
const Product = ({ product }) => {
    console.log('from product', product);
    return (
        <div
            className="py-2 px-2 bg-cover bg-center"
            style={{ backgroundImage: `url(${servicesBg})` }}
        >
            <div
                key={product.id}
                className="relative rounded-lg overflow-hidden border border-gray-200 shadow-lg transition-transform transform hover:scale-105 bg-white max-w-sm sm:max-w-md lg:max-w-3xl xl:max-w-4xl mx-auto"
            >
                {/* Product Image */}
                <div className="w-full h-auto">
                    <Link href={route("product-view", { id: product.id })}>
                        <img
                            src={`/public/images/products/${product.image1}`}
                            alt={product.product_name}
                            className="w-full h-auto object-cover rounded-t-lg sm:h-80 lg:h-96 xl:h-[400px]"
                            style={{
                                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                            }}
                        />
                    </Link>
                </div>

                {/* Product Info */}
                <div className="relative flex flex-col justify-end">
                    {/* Increased padding */}
                    <h2 className="text-lg md:text-xl font-semibold text-gray-800 truncate">
                        {product.product_name}
                    </h2>
                    <div className="flex justify-center items-center space-x-4 mb-2">
                        <p className="text-lg md:text-sm text-green-500 font-semibold mb-2 text-center">
                            Price: {product.sales_price}
                        </p>
                        <p className="text-sm md:text-sm font-sm mb-1 text-red-500 line-through">
                            Previous Price: {product.previous_price}
                        </p>
                    </div>
                    {/* Action Buttons */}
                    <div className="flex justify-center space-x-4">
                        <Link
                            href={route("product-view", { id: product.id })}
                            className="w-full flex items-center justify-evenly bg-blue-500 hover:bg-green-600 text-white text-center font-semibold py-2 px-2 rounded-lg shadow-md transition-all"
                        >
                            {/* Icon */}
                            <GiShoppingCart className="w-6 h-6" />
                            {/* Text */}
                            <span>Add to Cart</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Product;
