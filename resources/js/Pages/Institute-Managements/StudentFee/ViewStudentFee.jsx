import React from 'react';
import { Link } from '@inertiajs/react';

const ViewStudentFee = ({ studentFees }) => {
    // Payments group by type
    const groupPaymentsByType = (payments) => {
        const grouped = {};
        payments.forEach((p) => {
            if (!grouped[p.type]) grouped[p.type] = [];
            grouped[p.type].push(p);
        });
        return grouped;
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">💰 Student Fees</h1>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-2 text-left text-gray-700">Student</th>
                            <th className="px-4 py-2 text-left text-gray-700">Class</th>
                            {/* <th className="px-4 py-2 text-left text-gray-700">Payments</th> */}
                            <th className="px-4 py-2 text-left text-gray-700">Tuition Months</th>
                            <th className="px-4 py-2 text-left text-gray-700">Total Paid</th>
                            <th className="px-4 py-2 text-left text-gray-700">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {studentFees.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center py-6 text-gray-400">
                                    No student fees found.
                                </td>
                            </tr>
                        ) : (
                            studentFees.map((sf) => {
                                const groupedPayments = groupPaymentsByType(sf.payments || []);
                                return (
                                    <tr key={sf.id} className="hover:bg-gray-50 border-b">
                                        {/* Student */}
                                        <td className="px-4 py-3">{sf.student?.student_name || '-'}</td>

                                        {/* Class */}
                                        <td className="px-4 py-3">{sf.student?.school_class?.class_name || '-'}</td>

                                        {/* Payments */}
                                        {/* <td className="px-4 py-3">
                                            {Object.keys(groupedPayments).length > 0 ? (
                                                Object.entries(groupedPayments).map(([type, payments]) => (
                                                    <div key={type} className="mb-2">
                                                        <h4 className="font-semibold capitalize text-gray-700">
                                                            {type === 'tuition'
                                                                ? 'Tuition'
                                                                : type === 'exam'
                                                                    ? 'Exam'
                                                                    : 'Admission'}
                                                        </h4>
                                                        <ul className="list-disc list-inside text-gray-600 text-sm">
                                                            {payments.map((p, idx) => (
                                                                <li key={idx}>
                                                                    {p.month ? `${p.month} - ` : ''}
                                                                    {p.paid_amount}৳ ({p.payment_method})
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                ))
                                            ) : (
                                                <span className="text-gray-400">No payments</span>
                                            )}
                                        </td> */}

                                        {/* Tuition Months */}
                                        <td className="px-4 py-3">
                                            {groupedPayments.tuition
                                                ?.map((p) => p.month)
                                                .join(', ') || '-'}
                                        </td>

                                        {/* Total Paid */}
                                        <td className="px-4 py-3 font-semibold text-gray-800">
                                            {Number(sf.total_paid).toFixed(2)}৳
                                        </td>

                                        {/* Actions */}
                                        <td className="px-4 py-3 space-x-2">
                                            <Link
                                                href={route('student-fees.create-edit')}
                                                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                                            >
                                                Edit
                                            </Link>
                                            <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm">
                                                Delete
                                            </button>
                                            <Link
                                                href={route('student-fees.show', sf.student_id)}
                                                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                                            >
                                                Show
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ViewStudentFee;
