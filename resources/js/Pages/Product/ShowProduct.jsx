import AdminDashboardLayout from "@/backend/Dashboard/AdminDashboardLayout";
import { Head } from "@inertiajs/react";
import React from "react";

const ShowProduct = ({ auth, product }) => {
    return (
        <AdminDashboardLayout
            user={auth.user}
            header={
                <h1 className="font-semibold text-xl text-gray-800 leading-tight">
                    Show Product
                </h1>
            }
        >
            <Head title="Show Product" />
            <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-md">
                <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                    Product Details
                </h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                        { label: "Product ID", value: product.product_id },
                        { label: "Product Name", value: product.product_name },
                        { label: "Category ID", value: product.category_id },
                        { label: "Category Name", value: product.category_name },
                        { label: "SKU", value: product.sku },
                        { label: "Purchase Date", value: product.purchase_date },
                        { label: "Supplier Name", value: product.supplier_name },
                        { label: "Slug", value: product.slug },
                        { label: "Stock In", value: product.stock_in },
                        { label: "Stock Out", value: product.stock_out },
                        {
                            label: "Purchase Price",
                            value: `Tk ${product.purchase_price}`,
                        },
                        {
                            label: "Sales Price",
                            value: `Tk ${product.sales_price}`,
                        },
                        {
                            label: "Previous Price",
                            value: `Tk ${product.previous_price}`,
                        },
                        {
                            label: "Profit",
                            value: `Tk ${product.profit}`,
                        },
                        { label: "User Name", value: product.user_name },
                    ].map((item, index) => (
                        <div key={index} className="flex flex-col">
                            <span className="font-medium text-gray-600">
                                {item.label}
                            </span>
                            <span className="text-gray-800">{item.value}</span>
                        </div>
                    ))}

                    {/* Images */}
                    <div className="flex flex-col sm:col-span-2 lg:col-span-3">
                        <span className="font-medium text-gray-600">Images</span>
                        <div className="flex flex-wrap gap-4 mt-2">
                            {[product.image1, product.image2, product.image3, product.image4, product.image5]
                                .filter(Boolean)
                                .map((image, index) => (
                                    <img
                                        key={index}
                                        src={`/public/images/products/${image}`}
                                        alt={`Product Image ${index + 1}`}
                                        className="w-24 h-24 object-cover rounded shadow-md"
                                    />
                                ))}
                        </div>
                    </div>

                    {/* Description */}
                    <div className="sm:col-span-2 lg:col-span-3">
                        <div className="text-lg text-gray-700">
                            <strong className="font-semibold">Description:</strong>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {product.description
                                    .split(/,|।/)
                                    .map((item, index) => (
                                        <span
                                            key={index}
                                            className="bg-gray-100 text-gray-800 px-3 py-1 rounded-md shadow-sm"
                                        >
                                            {item.trim()}
                                        </span>
                                    ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminDashboardLayout>
    );
};

export default ShowProduct;
