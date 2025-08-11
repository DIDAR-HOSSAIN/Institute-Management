import { useForm } from '@inertiajs/react';
import React, { useEffect } from 'react';

const EditEmployee = ({ employee, rosters }) => {
    const { data, setData, put, processing, errors } = useForm({
        name: employee.name || '',
        employee_id: employee.employee_id || '',
        roster_id: employee.roster_id || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/employees/${employee.id}`);
    };

    return (
        <div className="p-4 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Edit Employee</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-1 font-medium">Name</label>
                    <input
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        className="w-full border rounded p-2"
                    />
                    {errors.name && (
                        <div className="text-red-600 text-sm">{errors.name}</div>
                    )}
                </div>

                <div>
                    <label className="block mb-1 font-medium">Employee ID (ZK Device)</label>
                    <input
                        type="text"
                        value={data.employee_id}
                        onChange={(e) => setData('employee_id', e.target.value)}
                        className="w-full border rounded p-2"
                    />
                    {errors.employee_id && (
                        <div className="text-red-600 text-sm">{errors.employee_id}</div>
                    )}
                </div>

                <div>
                    <label className="block mb-1 font-medium">Roster</label>
                    <select
                        value={data.roster_id || ''}
                        onChange={(e) => setData('roster_id', e.target.value)}
                        className="w-full border rounded p-2"
                    >
                        <option value="">-- Select Roster --</option>
                        {rosters.map((r) => (
                            <option key={r.id} value={r.id}>
                                {r.office_start} - {r.office_end}
                            </option>
                        ))}
                    </select>
                    {errors.roster_id && (
                        <div className="text-red-600 text-sm">{errors.roster_id}</div>
                    )}
                </div>

                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    disabled={processing}
                >
                    {processing ? 'Updating...' : 'Update'}
                </button>
            </form>
        </div>
    );
};

export default EditEmployee;
