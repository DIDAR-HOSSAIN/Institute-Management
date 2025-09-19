import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import Logo from "@/assets/images/Logo/school_logo.png";
import AdminDashboardLayout from "@/backend/Dashboard/AdminDashboardLayout";

const MoneyReceipt = ({ studentFee, auth }) => {
    console.log('student fee', studentFee);
    const printRef = useRef();

    // ✅ Date format helper
    const formatDate = (dateStr) => {
        if (!dateStr) return "-";
        const date = new Date(dateStr);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const handlePrint = useReactToPrint({
        content: () => printRef.current,
    });

    return (
        <AdminDashboardLayout
            user={auth.user}
            header={
                <h1 className="font-semibold text-xl text-gray-800 leading-tight">
                    Money Receipt
                </h1>
            }
        >
        <div className="flex flex-col items-center p-6">
            {/* Receipt Section */}
            <div
                ref={printRef}
                className="w-full max-w-3xl bg-white p-8 border"
            >
                {/* Header */}
                <div className="text-center border-b pb-4 mb-6">
                    {/* Logo */}
                    <div className="flex justify-center mb-2">
                        <img
                            src={Logo} // 👉 তোমার লোগোর path দাও
                            alt="School Logo"
                            className="h-16 w-16 object-contain"
                        />
                    </div>

                    {/* School Info */}
                    <h1 className="text-3xl font-bold text-indigo-700 uppercase">
                        EZ School
                    </h1>
                    <p className="text-gray-600 text-sm">123, Main Road, Dhaka-1200</p>
                    <p className="text-gray-600 text-sm">Phone: +880123456789</p>
                    <p className="text-gray-600 text-sm">Email: info@xyzschool.com</p>

                    {/* Receipt Title */}
                    <h2 className="text-xl font-semibold mt-4 underline">
                        Money Receipt
                    </h2>
                </div>

                {/* Student Info */}
                <div className="mb-6 grid grid-cols-2 gap-4 text-sm">
                    <p>
                        <span className="font-semibold">Student Name:</span>{" "}
                        {studentFee.student.student_name}
                    </p>
                    <p>
                        <span className="font-semibold">Class:</span> {studentFee.student.school_class.class_name}
                    </p>
                    <p>
                        <span className="font-semibold">Roll:</span> {studentFee.student.roll_number}
                    </p>
                    <p>
                        <span className="font-semibold">Last Payment Date:</span>{" "}
                        {formatDate(studentFee.last_payment_date)}
                    </p>
                </div>

                {/* Fee Table */}
                <table className="w-full text-sm border border-gray-300 mb-6">
                    <thead>
                        <tr className="bg-indigo-100">
                            <th className="border px-2 py-1">SL</th>
                            <th className="border px-2 py-1">Type</th>
                            <th className="border px-2 py-1">Month</th>
                            <th className="border px-2 py-1">Paid Amount</th>
                            <th className="border px-2 py-1">Payment Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {studentFee.payments?.map((p, i) => (
                            <tr key={i}>
                                <td className="border px-2 py-1 text-center">{i + 1}</td>
                                <td className="border px-2 py-1">{p.type}</td>
                                <td className="border px-2 py-1">{p.month ?? "-"}</td>
                                <td className="border px-2 py-1 text-right">{p.paid_amount}</td>
                                <td className="border px-2 py-1 text-center">
                                    {formatDate(p.payment_date)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Summary */}
                <div className="grid grid-cols-2 text-sm gap-4">
                    <p>
                        <span className="font-semibold">Total Fee:</span>{" "}
                        {studentFee.total_fee}
                    </p>
                    <p>
                        <span className="font-semibold">Total Paid:</span>{" "}
                        {studentFee.total_paid}
                    </p>
                    <p>
                        <span className="font-semibold">Total Due:</span>{" "}
                        {studentFee.total_due}
                    </p>
                </div>

                {/* Footer */}
                <div className="text-center mt-10 text-gray-500 text-xs">
                    <p>Thank you for your payment!</p>
                    <p className="italic">This is a computer-generated receipt</p>
                </div>
            </div>

            {/* Print Button */}
            <button
                onClick={handlePrint}
                className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-6 py-2"
            >
                Print Receipt
            </button>
        </div>
        </AdminDashboardLayout>
    );
};

export default MoneyReceipt;
