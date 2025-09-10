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

    return (
        <div className="p-4 max-w-7xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold mb-6">Student Fees Details</h2>

            {studentFees.map((sf) => (
                <div key={sf.id} className="p-4 border rounded-lg shadow-sm bg-white">
                    {/* Student & Fee Info */}
                    <div className="mb-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                        <p><strong>Student:</strong> {sf.student?.student_name || "-"}</p>
                        <p><strong>Class:</strong> {sf.student?.school_class?.class_name || "-"}</p>
                        <p><strong>Academic Year:</strong> {sf.student?.academic_year || "-"}</p>
                        <p><strong>Class Fee Amount:</strong> {sf.classFee?.amount || "-"}৳</p>
                        <p><strong>Fee Name:</strong> {sf.classFee?.fee?.name || "-"}</p>
                        <p><strong>Payment Method:</strong> {sf.payment_method || "-"}</p>
                        <p><strong>Total Paid:</strong> {sf.total_paid}৳</p>
                        <p><strong>Last Payment Date:</strong> {sf.last_payment_date || "-"}</p>
                        <p><strong>Months:</strong> {(sf.months || []).join(", ") || "-"}</p>
                        <p><strong>Created At:</strong> {sf.created_at ? new Date(sf.created_at).toLocaleString() : "-"}</p>
                        <p><strong>Updated At:</strong> {sf.updated_at ? new Date(sf.updated_at).toLocaleString() : "-"}</p>
                    </div>

                    {/* Payments Table */}
                    {sf.payments && sf.payments.length > 0 && (
                        <div className="overflow-x-auto mt-4">
                            <h3 className="font-semibold mb-2">Payment History</h3>
                            <table className="table-auto border-collapse border border-gray-300 w-full text-sm">
                                <thead>
                                    <tr className="bg-gray-200">
                                        <th className="border px-2 py-1">ID</th>
                                        <th className="border px-2 py-1">Paid Amount</th>
                                        <th className="border px-2 py-1">Payment Method</th>
                                        <th className="border px-2 py-1">Month</th>
                                        <th className="border px-2 py-1">Payment Date</th>
                                        <th className="border px-2 py-1">Created At</th>
                                        <th className="border px-2 py-1">Updated At</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sf.payments.map((p) => (
                                        <tr key={p.id} className="hover:bg-gray-50">
                                            <td className="border px-2 py-1">{p.id}</td>
                                            <td className="border px-2 py-1">{p.paid_amount}৳</td>
                                            <td className="border px-2 py-1">{p.payment_method}</td>
                                            <td className="border px-2 py-1">{p.month || "-"}</td>
                                            <td className="border px-2 py-1">{p.payment_date ? new Date(p.payment_date).toLocaleDateString() : "-"}</td>
                                            <td className="border px-2 py-1">{p.created_at ? new Date(p.created_at).toLocaleString() : "-"}</td>
                                            <td className="border px-2 py-1">{p.updated_at ? new Date(p.updated_at).toLocaleString() : "-"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
