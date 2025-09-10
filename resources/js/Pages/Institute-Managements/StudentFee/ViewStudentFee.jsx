import React from 'react';
import { Inertia } from '@inertiajs/inertia';
import { Link } from '@inertiajs/react';

const ViewStudentFee = ({ studentFees, fees }) => {
    console.log('view', studentFees);
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Student Fees</h1>

            <table className="table-auto border-collapse border border-gray-300 w-full mb-4">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border px-2 py-1">Student Name</th>
                        <th className="border px-2 py-1">Class</th>
                        <th className="border px-2 py-1">Fee Type</th>
                        <th className="border px-2 py-1">Total Paid</th>
                        <th className="border px-2 py-1">Months</th>
                        <th className="border px-2 py-1">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {studentFees.map((sf) => (
                        
                        <tr key={sf.id} className="hover:bg-gray-50">
                            <td className="border px-2 py-1">{sf.student?.student_name || '-'}</td>
                            <td className="border px-2 py-1">{sf.student?.school_class?.class_name || '-'}-{sf.student_id}</td>
                            <td className="border px-2 py-1">{sf.class_fee?.fee?.name || '-'}</td>
                            <td className="border px-2 py-1">{sf.total_paid}</td>
                            <td className="border px-2 py-1">{(sf.months || []).join(', ') || '-'}</td>
                            <td className="border px-2 py-1 space-x-1">
                                <Link
                                    href={`/student-fees/${sf.student_id}/edit-all`}
                                    className="bg-green-500 text-white px-2 py-1 rounded"
                                >
                                    Edit
                                </Link>
                                <button className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
                                <Link
                                    href={route('student-fees.show', sf.student_id)} 
                                    className="bg-blue-500 text-white px-2 py-1 rounded"
                                >
                                    Show
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ViewStudentFee;
