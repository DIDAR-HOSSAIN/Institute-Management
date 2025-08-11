import React from "react";
import { Head, useForm } from "@inertiajs/react";
import AdminDashboardLayout from "@/backend/Dashboard/AdminDashboardLayout";

const EditCategory = ({ auth, category }) => {
    const { data, setData, put, processing, errors } = useForm({
        category_name: category.category_name,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/categories/${category.id}`);
    };

    return (
        <AdminDashboardLayout
            user={auth.user}
            header={
                <h1 className="font-semibold text-xl text-gray-800 leading-tight">
                    Edit Category
                </h1>
            }
        >
            <Head title="Edit Category" />
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 bg-white border-b border-gray-200">
                        <form onSubmit={handleSubmit}>
                            <div>
                                <label
                                    htmlFor="category_name"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Category Name
                                </label>
                                <input
                                    type="text"
                                    id="category_name"
                                    value={data.category_name}
                                    onChange={(e) =>
                                        setData(
                                            "category_name",
                                            e.target.value
                                        )
                                    }
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    required
                                />
                                {errors.category_name && (
                                    <div className="text-red-600 mt-2">
                                        {errors.category_name}
                                    </div>
                                )}
                            </div>
                            <button
                                type="submit"
                                className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                disabled={processing}
                            >
                                Update
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </AdminDashboardLayout>
    );
};

export default EditCategory;
