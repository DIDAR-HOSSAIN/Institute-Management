import React from "react";
import { Link, usePage, router } from "@inertiajs/react";

const ViewStudentFee = () => {
    const { studentFees } = usePage().props;
    console.log('student fees', studentFees);
    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this record?")) {
            router.delete(route("student-fees.destroy", id));
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">📋 Student Fee Records</h1>
                <Link
                    href={route("student-fees.create")}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    + Add Fee
                </Link>
            </div>

            <div className="overflow-x-auto bg-white shadow rounded-lg">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-100 text-left">
                            <th className="border px-4 py-2">#</th>
                            <th className="border px-4 py-2">Student</th>
                            <th className="border px-4 py-2">Fee</th>
                            <th className="border px-4 py-2">Paid Amount</th>
                            <th className="border px-4 py-2">Months/Terms</th>
                            <th className="border px-4 py-2">Payment Method</th>
                            <th className="border px-4 py-2">Payment Date</th>
                            <th className="border px-4 py-2">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {studentFees.length > 0 ? (
                            
                            studentFees.map((fee, index) => (
                                <tr key={fee.id} className="hover:bg-gray-50">
                                    <td className="border px-4 py-2">
                                        {index + 1}
                                    </td>
                                    <td className="border px-4 py-2">
                                        {fee.student?.student_name} (
                                        {fee.student?.roll_number})
                                    </td>
                                    <td className="border px-4 py-2">
                                        {fee.fee?.name} ({fee.fee?.type})
                                    </td>
                                    <td className="border px-4 py-2">
                                        ৳{fee.paid_amount}
                                    </td>
                                    <td className="border px-4 py-2">
                                        {(() => {
                                            if (!fee.months) return "-";
                                            if (Array.isArray(fee.months)) return fee.months.join(", ");
                                            try {
                                                const parsed = JSON.parse(fee.months);
                                                if (Array.isArray(parsed)) return parsed.join(", ");
                                                return parsed;
                                            } catch {
                                                return fee.months;
                                            }
                                        })()}
                                    </td>

                                    <td className="border px-4 py-2">
                                        {fee.payment_method}
                                    </td>
                                    <td className="border px-4 py-2">
                                        {fee.payment_date
                                            ? new Date(
                                                fee.payment_date
                                            ).toLocaleDateString()
                                            : "-"}
                                    </td>
                                    <td className="border px-4 py-2 space-x-2">
                                        <Link
                                            href={route("student-fees.edit", fee.id)}
                                            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                                        >
                                            Edit
                                        </Link>


                                        <button
                                            onClick={() => handleDelete(fee.id)}
                                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="8"
                                    className="text-center text-gray-500 py-4"
                                >
                                    No records found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ViewStudentFee;
