import { useForm } from '@inertiajs/inertia-react';
import React from 'react';

const CreateEmployee = ({ rosters }) => {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        employee_id: '',
        roster_id: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/employees');
    };

    return (
        <div className="p-6 max-w-xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Add Employee</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-1 font-medium">Name</label>
                    <input
                        type="text"
                        value={data.name}
                        onChange={e => setData('name', e.target.value)}
                        className="w-full border rounded p-2"
                    />
                    {errors.name && <div className="text-red-600 text-sm">{errors.name}</div>}
                </div>

                <div>
                    <label className="block mb-1 font-medium">Employee ID (ZK Device)</label>
                    <input
                        type="text"
                        value={data.employee_id}
                        onChange={e => setData('employee_id', e.target.value)}
                        className="w-full border rounded p-2"
                    />
                    {errors.employee_id && <div className="text-red-600 text-sm">{errors.employee_id}</div>}
                </div>

                <div>
                    <label className="block mb-1 font-medium">Roster</label>
                    <select
                        value={data.roster_id || ''}
                        onChange={e => setData('roster_id', e.target.value)}
                        className="w-full border rounded p-2"
                    >
                        <option value="">-- Select Roster --</option>
                        {rosters.map(r => (
                            <option key={r.id} value={r.id}>
                                {r.office_start} - {r.office_end}
                            </option>
                        ))}
                    </select>
                    {errors.roster_id && <div className="text-red-600 text-sm">{errors.roster_id}</div>}
                </div>

                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    disabled={processing}
                >
                    {processing ? 'Saving...' : 'Save'}
                </button>
            </form>
        </div>
    );
};

export default CreateEmployee;
