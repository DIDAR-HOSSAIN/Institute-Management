import React from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import { Inertia } from "@inertiajs/inertia";
import Swal from "sweetalert2";
import { hasRole } from "@/backend/Utils/RoleCheck";
import AdminDashboardLayout from "@/backend/Dashboard/AdminDashboardLayout";

const PermissionList = () => {
    const { auth, permissions } = usePage().props;

    const destroy = (id) => {
        Swal.fire({
            title: "Are you sure permission Delete ?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                Inertia.delete(route("permissions.destroy", { id: id }), {
                    onSuccess: () => {
                        Swal.fire({
                            title: "Deleted!",
                            text: "Permission has been deleted.",
                            icon: "success",
                        }).then(() => {
                            // Optional: reload the page or update the state to reflect the changes
                            Inertia.visit(route("permissions.index"));
                        });
                    },
                    onError: () => {
                        Swal.fire({
                            title: "Error!",
                            text: "There was an error deleting the permission.",
                            icon: "error",
                        });
                    },
                });
            }
        });
    };

    return (
            <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-700">
                        Permissions
                    </h1>
                    {hasRole(auth.user, "super-admin") && (
                        <Link href="/roles/create">
                            <button className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                                Create Role
                            </button>
                        </Link>
                    )}
                </div>
                <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {permissions?.map((permission) => (
                                <tr key={permission.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {permission.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <Link
                                            href={`/permissions/${permission.id}`}
                                            className="text-blue-600 hover:text-blue-900 mr-4"
                                        >
                                            Show
                                        </Link>
                                        <Link
                                            href={`/permissions/${permission.id}/edit`}
                                            className="text-green-600 hover:text-green-900 mr-4"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() =>
                                                destroy(permission.id)
                                            }
                                            tabIndex="-1"
                                            type="button"
                                            className="px-4 py-2 text-sm text-white bg-red-500 rounded"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
    );
};

export default PermissionList;
