import React from "react";

const MoneyReceipt = ({ studentFee }) => {
    const student = studentFee.student;

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
            {/* Header */}
            <div className="text-center mb-6 border-b pb-4">
                <h1 className="text-2xl font-bold">Money Receipt</h1>
                <p className="text-sm text-gray-600">Date: {studentFee.last_payment_date}</p>
            </div>

            {/* Student Info */}
            <div className="mb-4">
                <h2 className="text-lg font-semibold">Student Information</h2>
                <p><span className="font-medium">ID:</span> {student?.id}</p>
                <p><span className="font-medium">Name:</span> {student?.name}</p>
            </div>

            {/* Summary */}
            <div className="mb-6">
                <h2 className="text-lg font-semibold">Payment Summary</h2>
                <p><span className="font-medium">Total Paid:</span> {studentFee.total_paid} BDT</p>
                <p><span className="font-medium">Last Payment Date:</span> {studentFee.last_payment_date}</p>
            </div>

            {/* Payment History */}
            <div>
                <h2 className="text-lg font-semibold mb-2">Payment History</h2>
                <table className="w-full border border-gray-300 text-sm">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border px-2 py-1">Date</th>
                            <th className="border px-2 py-1">Type</th>
                            <th className="border px-2 py-1">Month/Exam</th>
                            <th className="border px-2 py-1">Amount</th>
                            <th className="border px-2 py-1">Method</th>
                        </tr>
                    </thead>
                    <tbody>
                        {studentFee.payments.map((payment) => (
                            <tr key={payment.id}>
                                <td className="border px-2 py-1">{payment.payment_date}</td>
                                <td className="border px-2 py-1 capitalize">{payment.type}</td>
                                <td className="border px-2 py-1">{payment.month || "-"}</td>
                                <td className="border px-2 py-1">{payment.paid_amount} BDT</td>
                                <td className="border px-2 py-1">{payment.payment_method}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Footer */}
            <div className="text-center mt-6 text-gray-500 text-sm">
                <p>--- End of Receipt ---</p>
            </div>
        </div>
    );
};

export default MoneyReceipt;
