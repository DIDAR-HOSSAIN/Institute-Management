import React from "react";
import { Head, Link } from "@inertiajs/react";
import AdminDashboardLayout from "@/backend/Dashboard/AdminDashboardLayout";
import { Inertia } from "@inertiajs/inertia";

const ViewSlider = ({ auth, sliders }) => {
    function destroy(e) {
        if (confirm("Are you sure you want to delete this Slider?")) {
            Inertia.delete(route("sliders.destroy", e.currentTarget.id));
        }
    }

    return (
        <AdminDashboardLayout
            user={auth.user}
            header={
                <h1 className="font-semibold text-xl text-gray-800 leading-tight">
                    Manage Slider
                </h1>
            }
        >
            <Head title="Manage Slider" />
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-700">
                        Manage Slider
                    </h1>
                    <Link href="/sliders/create">
                        <button className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                            Add New Slide
                        </button>
                    </Link>
                </div>
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 bg-white border-b border-gray-200">
                        {sliders.length === 0 ? (
                            <div className="text-gray-600">
                                No sliders found.
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white">
                                    <thead>
                                        <tr>
                                            <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-sm font-medium text-gray-700">
                                                Slider Name
                                            </th>
                                            <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-sm font-medium text-gray-700">
                                                Slider Status
                                            </th>
                                            <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-sm font-medium text-gray-700">
                                                Image
                                            </th>
                                            <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-sm font-medium text-gray-700">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sliders.map(
                                            ({
                                                id,
                                                slider_name,
                                                status,
                                                image,
                                            }) => (
                                                <tr key={id}>
                                                    <td className="py-2 px-4 border-b border-gray-200">
                                                        {slider_name}
                                                    </td>
                                                    <td className="py-2 px-4 border-b border-gray-200">
                                                        {status === 1
                                                            ? "Active"
                                                            : "Inactive"}
                                                    </td>
                                                    <td className="py-2 px-4 border-b border-gray-200">
                                                        <img
                                                            src={`/public/images/slider/${image}`}
                                                            // src={`/images/slider/${image}`}
                                                            alt={slider_name}
                                                            className="h-16 w-auto object-cover"
                                                        />
                                                    </td>
                                                    <td className="py-2 px-4 border-b border-gray-200">
                                                        <div className="flex space-x-2">
                                                            <Link
                                                                href={route(
                                                                    "sliders.edit",
                                                                    id
                                                                )}
                                                                tabIndex="-1"
                                                                type="button"
                                                                className="px-4 py-2 text-sm text-white bg-yellow-500 rounded"
                                                            >
                                                                Edit
                                                            </Link>
                                                            <button
                                                                onClick={
                                                                    destroy
                                                                }
                                                                id={id}
                                                                tabIndex="-1"
                                                                type="button"
                                                                className="px-4 py-2 text-sm text-white bg-red-500 rounded"
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminDashboardLayout>
    );
};

export default ViewSlider;
