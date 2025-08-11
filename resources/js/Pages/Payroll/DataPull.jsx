import { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';
import { HiOutlineCheckCircle, HiOutlineExclamationTriangle } from 'react-icons/hi2';
import { FaSpinner } from 'react-icons/fa';

const AttendanceSync = () => {
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(false);

    const syncAttendance = () => {
        setLoading(true);
        setStatus(null);

        router.visit('/attendance/sync', {
            method: 'get',
            preserveScroll: true,
            onSuccess: () => {
                setStatus({ type: 'success', message: 'Attendance synced successfully!' });
            },
            onError: () => {
                setStatus({ type: 'error', message: 'Unable to sync attendance. Check device connection.' });
            },
            onFinish: () => setLoading(false),
        });
    };

    useEffect(() => {
        // Auto sync every 1 hour
        const interval = setInterval(() => {
            syncAttendance();
        }, 3600000); // 3,600,000 ms = 1 hour

        return () => clearInterval(interval); // Clean up on unmount
    }, []);


    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-indigo-100 px-4 py-8">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
                <h1 className="text-3xl font-semibold text-gray-800 mb-2">Sync Attendance</h1>
                <p className="text-sm text-gray-500 mb-6">Click the button or wait for auto sync every 1 minute.</p>

                {status && (
                    <div
                        className={`flex items-center gap-3 mb-5 px-4 py-3 rounded-lg text-sm font-medium
                            ${status.type === 'success'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'}`}
                    >
                        {status.type === 'success' ? (
                            <HiOutlineCheckCircle size={20} />
                        ) : (
                            <HiOutlineExclamationTriangle size={20} />
                        )}
                        {status.message}
                    </div>
                )}

                <button
                    onClick={syncAttendance}
                    disabled={loading}
                    className={`w-full flex items-center justify-center gap-2 py-3 px-6 rounded-lg text-white font-semibold text-lg transition duration-300
                        ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                    {loading ? (
                        <>
                            <FaSpinner className="animate-spin" />
                            Syncing...
                        </>
                    ) : (
                        'Sync Now'
                    )}
                </button>
            </div>
        </div>
    );
};

export default AttendanceSync;
