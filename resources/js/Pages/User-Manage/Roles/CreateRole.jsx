import React, { useState, useEffect } from "react";
import { Head, useForm } from "@inertiajs/react";
import AdminDashboardLayout from "@/backend/Dashboard/AdminDashboardLayout";

const CreateRole = ({ auth, permissions }) => {
    const [selectedPermissions, setSelectedPermissions] = useState([]);
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        permissions: [],
    });

    useEffect(() => {
        setData("permissions", selectedPermissions);
    }, [selectedPermissions]);

    const handlePermissionChange = (permissionId) => {
        setSelectedPermissions((prevPermissions) => {
            const updatedPermissions = prevPermissions.includes(permissionId)
                ? prevPermissions.filter((id) => id !== permissionId)
                : [...prevPermissions, permissionId];
            return updatedPermissions;
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/roles");
    };

    return (
        <AdminDashboardLayout
            user={auth.user}
            header={
                <h1 className="font-semibold text-xl text-gray-800 leading-tight">
                    Create Role
                </h1>
            }
        >
            <Head title="Create Role" />
            <div className="container mx-auto px-4 py-8">
                <form
                    onSubmit={handleSubmit}
                    className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto"
                >
                    <h2 className="text-2xl font-bold mb-6 text-center">
                        Create Role
                    </h2>
                    <div className="mb-4">
                        <label
                            htmlFor="name"
                            className="block text-gray-700 font-bold mb-2"
                        >
                            Role Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                        />
                        {errors.name && (
                            <div className="text-red-500 text-sm mt-1">
                                {errors.name}
                            </div>
                        )}
                    </div>
                    <div className="mb-4">
                        <h3 className="text-lg font-bold mb-2">Permissions</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {permissions.map((permission) => (
                                <div
                                    key={permission.id}
                                    className="flex items-center"
                                >
                                    <input
                                        type="checkbox"
                                        value={permission.id}
                                        checked={
                                            Array.isArray(data.permissions) &&
                                            data.permissions.includes(
                                                permission.id
                                            )
                                        }
                                        onChange={() =>
                                            handlePermissionChange(
                                                permission.id
                                            )
                                        }
                                        className="mr-2"
                                    />
                                    <label className="text-gray-700">
                                        {permission.name}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-center">
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition duration-200"
                        >
                            Create Role
                        </button>
                    </div>
                </form>
            </div>
        </AdminDashboardLayout>
    );
};

export default CreateRole;
