import React, { useState } from 'react';
import EditStudentFee from './EditStudentFee';

const ViewStudentFee = ({ studentFees, fees }) => {
    const [editingStudent, setEditingStudent] = useState(null);

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
                            <td className="border px-2 py-1">{sf.student?.school_class?.class_name || '-'}</td>
                            <td className="border px-2 py-1">{sf.class_fee?.fee?.name || '-'}</td>
                            <td className="border px-2 py-1">{sf.total_paid}</td>
                            <td className="border px-2 py-1">{(sf.months || []).join(', ') || '-'}</td>
                            <td className="border px-2 py-1">
                                <button
                                    className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                                    onClick={() => setEditingStudent(sf)}
                                >
                                    Edit
                                </button>
                                {/* Delete or Show button examples */}
                                <button className="bg-red-500 text-white px-2 py-1 rounded mr-2">Delete</button>
                                <button className="bg-blue-500 text-white px-2 py-1 rounded">Show</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* EditStudentFee Modal/Inline */}
            {editingStudent && (
                <div className="mt-4 border p-4 rounded shadow bg-gray-50">
                    <button
                        className="float-right bg-gray-400 text-white px-2 py-1 rounded mb-2"
                        onClick={() => setEditingStudent(null)}
                    >
                        Close
                    </button>
                    <EditStudentFee
                        student={editingStudent.student}
                        fees={fees}
                        studentFees={[editingStudent]}
                    />
                </div>
            )}
        </div>
    );
};

export default ViewStudentFee;
