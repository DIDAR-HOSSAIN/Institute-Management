import React from "react";
import { Link } from "@inertiajs/react";
import AdminDashboardLayout from "@/backend/Dashboard/AdminDashboardLayout";

const ShowStudentFee = ({ studentFee, auth }) => {
    if (!studentFee) {
        return (
            <div className="p-6 text-center text-gray-500">
                No data found for this student.
            </div>
        );
    }

    const groupedPayments = {};
    (studentFee.payments || []).forEach((p) => {
        if (!groupedPayments[p.type]) groupedPayments[p.type] = [];
        groupedPayments[p.type].push(p);
    });

    return (
        <AdminDashboardLayout
            user={auth.user}
            header={
                <h1 className="font-semibold text-xl text-gray-800 leading-tight">
                    Manage Students
                </h1>
            }
        >
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">
                💰 Student Fee Details
            </h1>

            {/* Student Info */}
            <div className="mb-6 bg-white shadow rounded-lg p-4">
                <h2 className="text-xl font-semibold mb-2">
                    {studentFee.student?.student_name || "-"}
                </h2>
                <p className="text-gray-600">
                    <strong>Class:</strong>{" "}
                    {studentFee.student?.school_class?.class_name || "-"}
                </p>
                <p className="text-gray-600">
                    <strong>Total Paid:</strong>{" "}
                    {Number(studentFee.total_paid).toFixed(2)}৳
                </p>
            </div>

            {/* Payment Details */}
            <div className="bg-white shadow rounded-lg p-4">
                <h3 className="text-xl font-semibold mb-4">Payments</h3>

                {Object.keys(groupedPayments).length === 0 ? (
                    <p className="text-gray-400">No payments found.</p>
                ) : (
                    Object.entries(groupedPayments).map(([type, payments]) => (
                        <div key={type} className="mb-4">
                            <h4 className="text-lg font-semibold capitalize text-gray-700 mb-2">
                                {type === "tuition"
                                    ? "Tuition"
                                    : type === "exam"
                                        ? "Exam"
                                        : "Admission"}
                            </h4>
                            <ul className="list-disc list-inside text-gray-600">
                                {payments.map((p, idx) => (
                                    <li key={idx} className="mb-1">
                                        {p.month ? `${p.month} - ` : ""}
                                        {p.paid_amount}৳ ({p.payment_method})
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))
                )}
            </div>

            {/* Tuition Months */}
            <div className="bg-white shadow rounded-lg p-4 mt-4">
                <h3 className="text-xl font-semibold mb-2">Tuition Months</h3>
                <p className="text-gray-700">
                    {(groupedPayments.tuition || []).map((p) => p.month).join(", ") || "-"}
                </p>
            </div>

            {/* Back Button */}
            <div className="mt-6">
                <Link
                    href="/student-fees"
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                    ← Back to Student Fees
                </Link>
            </div>
        </div>
    </AdminDashboardLayout>
    );
};

export default ShowStudentFee;
