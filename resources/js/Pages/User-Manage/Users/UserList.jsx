import React from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import { Inertia } from "@inertiajs/inertia-react";
import { useForm } from "@inertiajs/inertia-react";
import AdminDashboardLayout from "@/backend/Dashboard/AdminDashboardLayout";
import { hasRole } from "@/backend/Utils/RoleCheck";

const UserList = ({ auth }) => {
    const { users } = usePage().props;

    const { data, setData, errors, put } = useForm();

    const handleToggleActive = async (id, isActive) => {
        try {
            await put(route("users.toggleActive", { id: id }), {
                user_status: !isActive,
            });

            console.log("User active status toggled successfully");
            // Optionally handle success response here
        } catch (error) {
            console.error("Error toggling user active status:", errors);
        }
    };

    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this user?")) {
            Inertia.delete(route("users.destroy", { id: id }))
                .then(() => {
                    console.log("User deleted successfully");
                    // Optionally handle success response here
                })
                .catch((error) => {
                    console.error("Error deleting user:", error);
                });
        }
    };

    return (
        <AdminDashboardLayout
            user={auth.user}
            header={
                <h1 className="font-semibold text-xl text-gray-800 leading-tight">
                    Manage User
                </h1>
            }
        >
            <Head title="Manage User" />
            <div className="container mx-auto px-4 py-8">
                {hasRole(auth.user, "super-admin") && (
                    <div className="flex justify-start items-center mb-6">
                        <Link
                            href="/users/create"
                            className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition duration-200"
                        >
                            Create New User
                        </Link>
                        <Link
                            href="/roles"
                            className="bg-red-600 text-white px-4 py-2 mx-2 rounded-lg shadow hover:bg-blue-600 transition duration-200"
                        >
                            Manage Roles
                        </Link>
                        <Link
                            href="/permissions/create"
                            className="bg-purple-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition duration-200"
                        >
                            Manage Permissions
                        </Link>
                    </div>
                )}
                <h1 className="text-2xl font-bold">Users</h1>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-300">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="py-2 px-4 border-b">Name</th>
                                <th className="py-2 px-4 border-b">Email</th>
                                <th className="py-2 px-4 border-b">Roles</th>
                                <th className="py-2 px-4 border-b">Status</th>
                                <th className="py-2 px-4 border-b">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.data.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-100">
                                    <td className="py-2 px-4 border-b">
                                        {user.name}
                                    </td>
                                    <td className="py-2 px-4 border-b">
                                        {user.email}
                                    </td>
                                    <td className="py-2 px-4 border-b">
                                        {Array.isArray(user.roles)
                                            ? user.roles
                                                  .map((role) => role.name)
                                                  .join(", ")
                                            : "No roles assigned"}
                                    </td>
                                    <td className="py-2 px-4 border-b">
                                        {user.user_status
                                            ? "Active"
                                            : "Inactive"}
                                    </td>
                                    {hasRole(auth.user, "super-admin") && (
                                        <td className="py-2 px-4 border-b flex justify-center space-x-2">
                                            <button
                                                onClick={() =>
                                                    handleToggleActive(
                                                        user.id,
                                                        user.user_status
                                                    )
                                                }
                                                className={`w-24 h-10 rounded-lg shadow transition duration-200 ${
                                                    user.user_status
                                                        ? "bg-green-500 hover:bg-green-600 text-white"
                                                        : "bg-gray-500 hover:bg-gray-600 text-white"
                                                }`}
                                            >
                                                {user.user_status
                                                    ? "Deactivate"
                                                    : "Activate"}
                                            </button>
                                            <Link
                                                href={`/users/${user.id}/edit`}
                                                className="w-24 h-10 bg-yellow-500 text-white rounded-lg shadow hover:bg-yellow-600 transition duration-200 flex items-center justify-center"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() =>
                                                    handleDelete(user.id)
                                                }
                                                className="w-24 h-10 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition duration-200"
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

export default UserList;
