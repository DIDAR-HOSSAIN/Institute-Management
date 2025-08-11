import { useForm } from '@inertiajs/inertia-react';
import React from 'react';

const CreateRoster = () => {
    const { data, setData, post, processing, errors } = useForm({
        office_start: '',
        office_end: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('rosters.store'));
    };

    return (
        <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-md mt-10">
            <h2 className="text-2xl font-bold mb-6 text-center">Add New Roster</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Office Start</label>
                    <input
                        type="time"
                        value={data.office_start}
                        onChange={e => setData('office_start', e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    />
                    {errors.office_start && <div className="text-red-500 text-sm">{errors.office_start}</div>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Office End</label>
                    <input
                        type="time"
                        value={data.office_end}
                        onChange={e => setData('office_end', e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    />
                    {errors.office_end && <div className="text-red-500 text-sm">{errors.office_end}</div>}
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
                >
                    {processing ? 'Saving...' : 'Save Roster'}
                </button>
            </form>
        </div>
    );
};

export default CreateRoster;
