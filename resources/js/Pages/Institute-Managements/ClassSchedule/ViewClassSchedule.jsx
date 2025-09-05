
import React from 'react';
import { Link, usePage, router } from '@inertiajs/react';

const ViewClassSchedule = () => {
    const { schedules, flash } = usePage().props;

    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this schedule?")) {
            router.delete(route('class-schedule.destroy', id));
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-6 bg-white shadow-md rounded">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Class Schedule List</h2>
                <Link
                    href={route('class-schedule.create')}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                    + Add New
                </Link>
            </div>

            {flash.success && (
                <div className="mb-4 text-green-600 font-medium">{flash.success}</div>
            )}

            <div className="overflow-x-auto">
                <table className="w-full border border-gray-200 rounded">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-2 border">#</th>
                            <th className="px-4 py-2 border">Class</th>
                            <th className="px-4 py-2 border">Section</th>
                            <th className="px-4 py-2 border">Schedule Name</th>
                            <th className="px-4 py-2 border">Start Time</th>
                            <th className="px-4 py-2 border">End Time</th>
                            <th className="px-4 py-2 border">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {schedules.length > 0 ? (
                            schedules.map((item, index) => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-2 border">{index + 1}</td>
                                    <td className="px-4 py-2 border">{item.class?.class_name}</td>
                                    <td className="px-4 py-2 border">{item.section?.section_name}</td>
                                    <td className="px-4 py-2 border">{item.schedule_name}</td>
                                    <td className="px-4 py-2 border">{item.start_time}</td>
                                    <td className="px-4 py-2 border">{item.end_time}</td>
                                    <td className="px-4 py-2 border flex gap-2">
                                        <Link
                                            href={route('class-schedule.edit', item.id)}
                                            className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="7"
                                    className="px-4 py-4 text-center text-gray-500"
                                >
                                    No schedules found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ViewClassSchedule;
