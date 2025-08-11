import AdminDashboardLayout from "@/backend/Dashboard/AdminDashboardLayout";
import { Head, Link } from "@inertiajs/react";
import { CSVLink } from "react-csv";
import { useEffect, useState } from "react";
import DateWiseReport from "./Reports/DateWiseReport";
import { Inertia } from "@inertiajs/inertia";
import Swal from "sweetalert2";

const ViewProduct = ({ auth, products }) => {
    console.log("product viewlist", products);

    const [filteredData, setFilteredData] = useState(products);
    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    const handlePerPageChange = (e) => {
        const value = e.target.value;
        setPerPage(value === "all" ? products.length : parseInt(value));
        setCurrentPage(1);
    };

    const totalPages =
        perPage === "all" ? 1 : Math.ceil(products.length / perPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    useEffect(() => {
        const startIndex = (currentPage - 1) * perPage;
        const endIndex = Math.min(startIndex + perPage, products.length);
        const displayedData = products.slice(startIndex, endIndex);
        setFilteredData(displayedData);
    }, [products, currentPage, perPage]);

    const formatDate = (dateString) => {
        const options = { day: "numeric", month: "short", year: "numeric" };
        return new Date(dateString).toLocaleDateString("en-GB", options);
    };

    const handleDateWiseSearch = (startDate, endDate) => {
        if (!startDate || !endDate) {
            setFilteredData(products);
            return;
        }

        const filteredData = products.filter((data) => {
            const entryDate = new Date(data.entry_date);
            return (
                entryDate >= startDate &&
                entryDate <= new Date(endDate.getTime() + 86400000)
            );
        });

        setFilteredData(filteredData);
    };

    const handleSearch = (searchTerm) => {
        const filtered = products.filter((data) => {
            return (
                data.product_name
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                data.patient_id.toLowerCase().includes(searchTerm.toLowerCase())
            );
        });

        setFilteredData(filtered);
    };

    const destroy = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
        }).then((result) => {
            if (result.isConfirmed) {
                // Send a DELETE request to delete the product
                Inertia.delete(route("products.destroy", id), {
                    onSuccess: () => {
                        Swal.fire(
                            "Deleted!",
                            "The product has been deleted.",
                            "success"
                        );
                    },
                    onError: () => {
                        Swal.fire(
                            "Error!",
                            "There was an issue deleting the product.",
                            "error"
                        );
                    },
                });
            }
        });
    };


    return (
        <AdminDashboardLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Manage Products
                </h2>
            }
        >
            <Head title="Manage Products" />

            <div className="py-2">
                <div className="mx-auto">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="flex items-center justify-between mb-6">
                                <Link
                                    className="px-6 py-2 text-white bg-green-500 rounded-md focus:outline-none"
                                    href={route("products.create")}
                                >
                                    Add Product
                                </Link>

                                <CSVLink
                                    data={filteredData}
                                    filename={"Dope Report.csv"}
                                    className="px-6 py-2 text-white bg-green-500 rounded-md focus:outline-none"
                                >
                                    Export
                                </CSVLink>
                            </div>

                            <div className="flex items-center justify-between mb-6">
                                <DateWiseReport
                                    data={products}
                                    onSearch={handleDateWiseSearch}
                                    startDateField="entry_date"
                                    endDateField="entry_date"
                                />

                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        className="px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                                        onChange={(e) =>
                                            handleSearch(e.target.value)
                                        }
                                    />
                                    <span className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                        {/* Add a search icon or clear button if needed */}
                                    </span>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full whitespace-nowrap">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th className="px-4 py-2">No.</th>
                                            <th className="px-4 py-2">
                                                Product ID
                                            </th>
                                            <th className="px-4 py-2">
                                                Image
                                            </th>
                                            <th className="px-4 py-2">
                                                Product Name
                                            </th>
                                            <th className="px-4 py-2">
                                                Purchase Price
                                            </th>
                                            <th className="px-4 py-2">
                                                Sales Price
                                            </th>
                                            <th className="px-4 py-2">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredData.map(
                                            (
                                                {
                                                    id,
                                                    product_id,
                                                    image1,
                                                    purchase_date,
                                                    product_name,
                                                    purchase_price,
                                                    sales_price,
                                                    profit,
                                                },
                                                index
                                            ) => (
                                                <tr key={id}>
                                                    <td className="border px-4 py-2">
                                                        {index + 1}
                                                    </td>
                                                    <td className="border px-4 py-2">
                                                        {product_id}
                                                    </td>
                                                    <td className="border px-4 py-2">
                                                        <img
                                                            src={`/public/images/products/${image1}`}
                                                            alt="Product Image"
                                                            className="w-16 h-auto object-cover"
                                                        />
                                                    </td>
                                                    <td className="border px-4 py-2">
                                                        {product_name}
                                                    </td>
                                                    <td className="border px-4 py-2">
                                                        {purchase_price}
                                                    </td>
                                                    <td className="border px-4 py-2">
                                                        {sales_price}
                                                    </td>
                                                    <td className="border px-4 py-2">
                                                        <Link
                                                            tabIndex="1"
                                                            className="px-4 py-2 text-sm text-white bg-blue-900 rounded"
                                                            href={route(
                                                                "products.show",
                                                                id
                                                            )}
                                                        >
                                                            Show
                                                        </Link>

                                                        <Link
                                                            tabIndex="1"
                                                            className=" mx-1 px-4 py-2 text-sm text-white bg-blue-500 rounded"
                                                            href={route(
                                                                "products.edit",
                                                                id
                                                            )}
                                                        >
                                                            Edit
                                                        </Link>
                                                        <button
                                                            onClick={() =>
                                                                destroy(id)
                                                            }
                                                            tabIndex="-1"
                                                            type="button"
                                                            className="px-4 py-2 text-sm text-white bg-red-500 rounded"
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            )
                                        )}

                                        {filteredData?.length === 0 && (
                                            <tr>
                                                <td
                                                    className="px-6 py-4 border-t"
                                                    colSpan="6"
                                                >
                                                    No Products found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>

                                {/* Pagination select controls */}
                                <div className="flex items-center justify-evenly mt-6">
                                    <select
                                        value={perPage}
                                        onChange={handlePerPageChange}
                                        className="px- py-2 border rounded-md"
                                    >
                                        <option value={10}>10</option>
                                        <option value={20}>20</option>
                                        <option value={30}>30</option>
                                        <option value={50}>50</option>
                                        <option value={100}>100</option>
                                        <option value="all">All</option>
                                    </select>

                                    {/* Pagination buttons */}
                                    <div className="flex">
                                        {Array.from(
                                            { length: totalPages },
                                            (_, index) => (
                                                <button
                                                    key={index}
                                                    className={`px-3 py-1 border ${currentPage ===
                                                            index + 1
                                                            ? "bg-blue-500 text-white"
                                                            : ""
                                                        }`}
                                                    onClick={() =>
                                                        handlePageChange(
                                                            index + 1
                                                        )
                                                    }
                                                >
                                                    {index + 1}
                                                </button>
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminDashboardLayout>
    );
};

export default ViewProduct;
