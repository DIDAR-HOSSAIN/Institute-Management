import React from "react";

export default function ShowStudentFee({ studentFees }) {
    if (!studentFees || studentFees.length === 0) {
        return (
            <div className="p-4">
                <h2 className="text-2xl font-bold mb-4">Student Fees</h2>
                <p className="text-gray-600">No student fees available.</p>
            </div>
        );
    }

    // Take first record for student/class info
    const studentInfo = studentFees[0];
    console.log('show studentInfo', studentInfo);

    // Merge all payments from all studentFees
    const allPayments = studentFees.flatMap((sf) => sf.payments || []);
    

    console.log('show allPayments', allPayments);

    return (
        <div className="p-4 max-w-7xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold mb-6">Student Fees Details</h2>

            {/* Student & Fee Info */}
            <div className="p-4 border rounded-lg shadow-sm bg-white">
                <div className="mb-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    <p><strong>Student:</strong> {studentInfo.student?.student_name || "-"}</p>
                    <p><strong>Class:</strong> {studentInfo.student?.school_class?.class_name || "-"}</p>
                    <p><strong>Academic Year:</strong> {studentInfo.student?.academic_year || "-"}</p>
                    <p><strong>Class Fee Amount:</strong> {studentInfo.class_fee?.amount || "-"}৳</p>
                    <p><strong>Payment Method:</strong> {studentInfo.payment_method || "-"}</p>
                    <p><strong>Total Paid:</strong> {
                        studentFees.reduce((sum, sf) => sum + Number(sf.total_paid || 0), 0)
                    }৳</p>
                    <p><strong>Last Payment Date:</strong> {studentInfo.last_payment_date || "-"}</p>
                    <p><strong>Months:</strong> {(studentInfo.months || []).join(", ") || "-"}</p>
                </div>
            </div>

            {/* Payments Table */}
            {allPayments.length > 0 && (
                <div className="overflow-x-auto mt-4">
                    <h3 className="font-semibold mb-2">Payment History</h3>
                    <table className="table-auto border-collapse border border-gray-300 w-full text-sm">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border px-2 py-1">ID</th>
                                <th className="border px-2 py-1">Paid Amount</th>
                                <th className="border px-2 py-1">Payment Method</th>
                                <th className="border px-2 py-1">Month</th>
                                <th className="border px-2 py-1">Fee Name</th>
                                <th className="border px-2 py-1">Payment Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allPayments.map((p) => (
                                <tr key={p.id} className="hover:bg-gray-50">
                                    <td className="border px-2 py-1">{p.id}</td>
                                    <td className="border px-2 py-1">{p.paid_amount}৳</td>
                                    <td className="border px-2 py-1">{p.payment_method}</td>
                                    <td className="border px-2 py-1">{p.month || "-"}</td>
                                    <td className="border px-2 py-1">{p.student_fee_id}</td>
                                    <td className="border px-2 py-1">
                                        {p.payment_date ? new Date(p.payment_date).toLocaleDateString() : "-"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
