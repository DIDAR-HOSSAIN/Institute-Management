import { Link } from '@inertiajs/react';

const ViewStudentFee = ({ studentFees }) => {
    return (
        <div className="p-6">
            <h1 className="text-xl font-bold mb-4">Student Fees</h1>

            <Link href={route('student-fees.create')} className="px-4 py-2 bg-blue-600 text-white rounded">
                + Add Student Fee
            </Link>

            <table className="mt-6 w-full border">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border px-3 py-2">Student</th>
                        <th className="border px-3 py-2">Fee</th>
                        <th className="border px-3 py-2">Total Paid</th>
                        <th className="border px-3 py-2">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {studentFees.map((sf) => (
                        <tr key={sf.id}>
                            <td className="border px-3 py-2">{sf.student?.name} ({sf.student_id})</td>
                            <td className="border px-3 py-2">{sf.fee?.name}</td>
                            <td className="border px-3 py-2">{sf.paid_amount}</td>
                            <td className="border px-3 py-2">
                                <Link href={route('student-fees.show', sf.id)} className="text-blue-600 underline">
                                    View
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
