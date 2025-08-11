import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';

const PayrollReport = ({ reportData = [] }) => {
    const { data, setData, get } = useForm({
        date: new Date().toISOString().split('T')[0],
    });

    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        get('/attendance/report', {
            preserveScroll: true,
            data: { date: data.date },
            onFinish: () => setLoading(false),
        });
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Head>
                <title>Attendance Report</title>
            </Head>

            <form onSubmit={handleSubmit} className="mb-4">
                <input
                    type="date"
                    value={data.date}
                    onChange={e => setData('date', e.target.value)}
                    className="border p-2 rounded"
                />
                <button type="submit" disabled={loading} className="ml-2 px-4 py-2 bg-blue-600 text-white rounded">
                    {loading ? 'Loading...' : 'Filter'}
                </button>
            </form>

            <table className="w-full border border-collapse">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border p-2">Name</th>
                        <th className="border p-2">Date</th>
                        <th className="border p-2">In Time</th>
                        <th className="border p-2">Out Time</th>
                        <th className="border p-2">Status</th>
                        <th className="border p-2">Source</th>
                    </tr>
                </thead>
                <tbody>
                    {reportData.map((item, index) => (
                        <tr key={index}>
                            <td className="border p-2">{item.name}</td>
                            <td className="border p-2">{item.date}</td>
                            <td className="border p-2">{item.in_time}</td>
                            <td className="border p-2">{item.out_time}</td>
                            <td className={`border p-2 ${item.status === 'Late' ? 'text-red-500' :
                                item.status === 'Early Leave' ? 'text-orange-500' :
                                    item.status === 'Absent' ? 'text-gray-500' :
                                        'text-green-600'
                                }`}>
                                {item.status}
                            </td>
                            <td className="border p-2">{item.source}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PayrollReport;
