import React from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import AdminDashboardLayout from "@/backend/Dashboard/AdminDashboardLayout";
import { Inertia } from "@inertiajs/inertia";

const ViewCategory = ({ auth }) => {
    const { categories } = usePage().props;

    function destroy(e) {
        if (confirm("Are you sure you want to delete this Category?")) {
            Inertia.delete(route("categories.destroy", e.currentTarget.id));
        }
    }

    return (
        <AdminDashboardLayout
            user={auth.user}
            header={
                <h1 className="font-semibold text-xl text-gray-800 leading-tight">
                    Manage Category
                </h1>
            }
        >
            <Head title="Manage Category" />
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 bg-white border-b border-gray-200">
                        {categories.length === 0 ? (
                            <div className="text-gray-600 text-center py-6">
                                No categories found.
                            </div>
                        ) : (
                            <div>
                                <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3">
                                    <Link
                                        href="/categories/create"
                                        className="w-full sm:w-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm"
                                    >
                                        Add New Category
                                    </Link>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                                        <thead>
                                            <tr className="bg-gray-50 text-gray-700 text-sm">
                                                <th className="py-2 px-4 border-b">
                                                    Category Name
                                                </th>
                                                <th className="py-2 px-4 border-b text-center">
                                                    Action
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {categories.map(
                                                ({ id, category_name }) => (
                                                    <tr
                                                        key={id}
                                                        className="hover:bg-gray-50"
                                                    >
                                                        <td className="py-3 px-4 border-b">
                                                            {category_name}
                                                        </td>
                                                        <td className="py-3 px-4 border-b flex flex-col sm:flex-row items-center justify-center gap-2">
                                                            <Link
                                                                href={route(
                                                                    "categories.edit",
                                                                    id
                                                                )}
                                                                className="w-full sm:w-auto px-3 py-2 text-sm text-white bg-yellow-500 rounded text-center"
                                                            >
                                                                Edit
                                                            </Link>
                                                            <button
                                                                onClick={
                                                                    destroy
                                                                }
                                                                id={id}
                                                                className="w-full sm:w-auto px-3 py-2 text-sm text-white bg-red-500 rounded"
                                                            >
                                                                Delete
                                                            </button>
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminDashboardLayout>
    );
};

export default ViewCategory;
