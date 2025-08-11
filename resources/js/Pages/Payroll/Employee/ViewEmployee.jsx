import { Link } from '@inertiajs/react';
import React from 'react';

const ViewEmployee = ({ employees }) => {
    return (
        <div className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                <h2 className="text-xl md:text-2xl font-bold">Employees</h2>
                <Link
                    href="/employees/create"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                    Add New
                </Link>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full border text-sm md:text-base">
                    <thead>
                        <tr className="bg-gray-100 text-left">
                            <th className="p-2 border">Name</th>
                            <th className="p-2 border">Employee ID</th>
                            <th className="p-2 border">Roster</th>
                            <th className="p-2 border">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map((emp) => (
                            <tr key={emp.id} className="hover:bg-gray-50">
                                <td className="p-2 border">{emp.name}</td>
                                <td className="p-2 border">{emp.employee_id}</td>
                                <td className="p-2 border">
                                    {emp.roster?.office_start} - {emp.roster?.office_end}
                                </td>
                                <td className="p-2 border">
                                    <Link
                                        href={`/employees/${emp.id}/edit`}
                                        className="text-blue-600 hover:underline"
                                    >
                                        Edit
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ViewEmployee;
