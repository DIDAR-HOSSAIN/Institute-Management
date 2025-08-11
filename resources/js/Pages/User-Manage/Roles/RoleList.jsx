import React from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import { Inertia } from "@inertiajs/inertia";
import Swal from "sweetalert2";
import AdminDashboardLayout from "@/backend/Dashboard/AdminDashboardLayout";
import { hasRole } from "@/backend/Utils/RoleCheck";

const RoleList = () => {
    const { auth, roles } = usePage().props;

    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure you want to delete this role?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                Inertia.delete(route("roles.destroy", { id: id }), {
                    onSuccess: () => {
                        Swal.fire({
                            title: "Deleted!",
                            text: "Role has been deleted.",
                            icon: "success",
                        }).then(() => {
                            Inertia.visit(route("roles.index"));
                        });
                    },
                    onError: () => {
                        Swal.fire({
                            title: "Error!",
                            text: "There was an error deleting the role.",
                            icon: "error",
                        });
                    },
                });
            }
        });
    };

    return (
        <AdminDashboardLayout
            user={auth.user}
            header={
                <h1 className="font-semibold text-xl text-gray-800 leading-tight">
                    Manage Roles
                </h1>
            }
        >
            <Head title="Manage Roles" />
            <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-700">
                        Manage Roles
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
                                <th className="px-6 py-3 text-left text-lg font-medium uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="px-6 py-3 text-left text-lg font-medium uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {roles.map((role) => (
                                <tr key={role.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-lg font-medium text-gray-900">
                                        {role.name}
                                    </td>
                                    {hasRole(auth.user, "super-admin") && (
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <Link
                                                href={`/roles/${role.id}`}
                                                className="bg-green-500 text-white py-2 px-4 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                                            >
                                                Show
                                            </Link>

                                            <Link
                                                href={`/roles/${role.id}/edit`}
                                                className=" mx-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                                            >
                                                Edit
                                            </Link>

                                            <button
                                                onClick={() =>
                                                    handleDelete(role.id)
                                                }
                                                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminDashboardLayout>
    );
};

export default RoleList;
