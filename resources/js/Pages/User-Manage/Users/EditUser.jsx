import React from 'react';
import { Inertia } from '@inertiajs/inertia';
import { Head, useForm } from '@inertiajs/react';
import AdminDashboardLayout from '@/backend/Dashboard/AdminDashboardLayout';

const EditUser = ({ auth, user, roles, userRoles }) => {
    const { data, setData, put, processing, errors } = useForm({
        name: user.name,
        email: user.email,
        password: '',
        password_confirmation: '',
        roles: userRoles
    });

    const handleChange = (e) => {
        setData(e.target.name, e.target.value);
    };

    const handleRolesChange = (e) => {
        const selectedRoles = Array.from(
            e.target.selectedOptions,
            (option) => option.value
        );
        setData('roles', selectedRoles);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('users.update', user.id), {
            onSuccess: () => {
                // Handle success (optional)
                Inertia.reload();
            }
        });
    };

    return (
        <AdminDashboardLayout
            user={auth.user}
            header={
                <h1 className="font-semibold text-xl text-gray-800 leading-tight">
                    Update User
                </h1>
            }
        >
            <Head title="Update User" />
            <div className="container mx-auto px-4 py-8 max-w-2xl">
                <h1 className="text-3xl font-bold mb-8 text-center">
                    Update User
                </h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex flex-col">
                        <label className="mb-2 text-lg font-semibold">
                            Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={data.name}
                            onChange={handleChange}
                            required
                            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                        />
                        {errors.name && (
                            <div className="text-red-500 mt-2">
                                {errors.name}
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col">
                        <label className="mb-2 text-lg font-semibold">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={data.email}
                            onChange={handleChange}
                            required
                            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                        />
                        {errors.email && (
                            <div className="text-red-500 mt-2">
                                {errors.email}
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col">
                        <label className="mb-2 text-lg font-semibold">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={data.password}
                            onChange={handleChange}
                            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                        />
                        {errors.password && (
                            <div className="text-red-500 mt-2">
                                {errors.password}
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col">
                        <label className="mb-2 text-lg font-semibold">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            onChange={handleChange}
                            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                        />
                        {errors.password_confirmation && (
                            <div className="text-red-500 mt-2">
                                {errors.password_confirmation}
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col">
                        <label className="mb-2 text-lg font-semibold">
                            Roles
                        </label>
                        <select
                            multiple
                            name="roles"
                            value={data.roles}
                            onChange={handleRolesChange}
                            required
                            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                        >
                            {roles.map((role) => (
                                <option key={role.id} value={role.id}>
                                    {role.name}
                                </option>
                            ))}
                        </select>
                        {errors.roles && (
                            <div className="text-red-500 mt-2">
                                {errors.roles}
                            </div>
                        )}
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                    >
                        Update User
                    </button>
                </form>
            </div>
        </AdminDashboardLayout>
    );
};

export default EditUser;
