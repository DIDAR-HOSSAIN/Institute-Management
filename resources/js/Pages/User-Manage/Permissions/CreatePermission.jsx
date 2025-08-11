import React from "react";
import { Head, useForm } from "@inertiajs/react";
import PermissionList from "./PermissionList";
import AdminDashboardLayout from "@/backend/Dashboard/AdminDashboardLayout";

const CreatePermission = ({ auth }) => {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("permissions.store"));
        reset();
    };

    return (
        <AdminDashboardLayout
            user={auth.user}
            header={
                <h1 className="font-semibold text-xl text-gray-800 leading-tight">
                    Create Permission
                </h1>
            }
        >
            <Head title="Create User" />
            <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
                <div className="flex flex-col md:flex-row">
                    {/* Create Permission Form */}
                    <div className="w-full md:w-1/3 bg-white p-6 rounded-lg shadow-md mb-6 md:mb-0 md:mr-6">
                        <h1 className="text-2xl font-bold text-center mb-6">
                            Create Permission
                        </h1>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label
                                    htmlFor="name"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Permission Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                                {errors.name && (
                                    <div className="text-red-600 text-sm mt-2">
                                        {errors.name}
                                    </div>
                                )}
                            </div>
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                            >
                                {processing ? "Creating..." : "Create"}
                            </button>
                        </form>
                    </div>

                    {/* Permission List */}

                    <PermissionList />
                </div>
            </div>
        </AdminDashboardLayout>
    );
};

export default CreatePermission;
