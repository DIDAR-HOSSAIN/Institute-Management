import { useForm } from '@inertiajs/react';

export default function ManualAttendance({ employees }) {
    const { data, setData, post, processing, errors } = useForm({
        employee_id: '',
        date: '',
        in_time: '',
        out_time: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('attendance.store'));
    };

    return (
        <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Manual Attendance Entry</h2>

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Employee</label>
                    <select
                        value={data.employee_id}
                        onChange={(e) => setData('employee_id', e.target.value)}
                        className="w-full border-gray-300 rounded-md"
                    >
                        <option value="">Select Employee</option>
                        {employees.map(emp => (
                            <option key={emp.id} value={emp.id}>{emp.name}</option>
                        ))}
                    </select>
                    {errors.employee_id && <p className="text-red-600 text-sm">{errors.employee_id}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Date</label>
                    <input
                        type="date"
                        value={data.date}
                        onChange={(e) => setData('date', e.target.value)}
                        className="w-full border-gray-300 rounded-md"
                    />
                    {errors.date && <p className="text-red-600 text-sm">{errors.date}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">In Time</label>
                        <input
                            type="time"
                            value={data.in_time}
                            onChange={(e) => setData('in_time', e.target.value)}
                            className="w-full border-gray-300 rounded-md"
                        />
                        {errors.in_time && <p className="text-red-600 text-sm">{errors.in_time}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Out Time</label>
                        <input
                            type="time"
                            value={data.out_time}
                            onChange={(e) => setData('out_time', e.target.value)}
                            className="w-full border-gray-300 rounded-md"
                        />
                        {errors.out_time && <p className="text-red-600 text-sm">{errors.out_time}</p>}
                    </div>
                </div>

                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md w-full"
                    disabled={processing}
                >
                    {processing ? 'Saving...' : 'Save Attendance'}
                </button>
            </form>
        </div>
    );
}
