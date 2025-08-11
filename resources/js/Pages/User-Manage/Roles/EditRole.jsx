import React from "react";
import { useForm, Inertia } from "@inertiajs/inertia-react";
import AdminDashboardLayout from "@/backend/Dashboard/AdminDashboardLayout";
import { Head } from "@inertiajs/react";

const EditRole = ({ auth, role, permissions }) => {
    const { data, setData, put, processing, errors } = useForm({
        _method: "put",
        name: role.name,
        permissions: role.permissions.map((p) => p.id),
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route("roles.update", role.id), {
            onSuccess: () => {
                Inertia.reload();
            },
        });
    };

    return (
        <AdminDashboardLayout
            user={auth.user}
            header={
                <h1 className="font-semibold text-xl text-gray-800 leading-tight">
                    Edit Role
                </h1>
            }
        >
            <Head title="Edit Role" />
            <div className="container mx-auto p-6">
                <h1 className="text-2xl font-bold mb-6">Edit Role</h1>
                <form onSubmit={handleSubmit} className="mx-auto">
                    <div className="mb-4">
                        <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Role Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            required
                        />
                        {errors.name && (
                            <div className="text-red-600 text-sm mt-2">
                                {errors.name}
                            </div>
                        )}
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                            Permissions
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {permissions.map((permission) => (
                                <div
                                    key={permission.id}
                                    className="flex items-center"
                                >
                                    <input
                                        type="checkbox"
                                        id={`permission-${permission.id}`}
                                        checked={data.permissions.includes(
                                            permission.id
                                        )}
                                        onChange={() => {
                                            const isChecked =
                                                data.permissions.includes(
                                                    permission.id
                                                );
                                            setData(
                                                "permissions",
                                                isChecked
                                                    ? data.permissions.filter(
                                                          (id) =>
                                                              id !==
                                                              permission.id
                                                      )
                                                    : [
                                                          ...data.permissions,
                                                          permission.id,
                                                      ]
                                            );
                                        }}
                                        className="mr-2"
                                    />
                                    <label
                                        htmlFor={`permission-${permission.id}`}
                                        className="text-gray-700"
                                    >
                                        {permission.name}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                    <button
                        type="submit"
                        className={`bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 ${
                            processing && "opacity-50 cursor-not-allowed"
                        }`}
                        disabled={processing}
                    >
                        {processing ? "Updating..." : "Update"}
                    </button>
                </form>
            </div>
        </AdminDashboardLayout>
    );
};

export default EditRole;
