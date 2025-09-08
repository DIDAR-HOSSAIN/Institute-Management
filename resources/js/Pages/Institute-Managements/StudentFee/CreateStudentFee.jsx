import React, { useState } from "react";
import { useForm } from "@inertiajs/react";

const CreateStudentFee = ({ students, fees }) => {
    const { data, setData, post, processing, errors } = useForm({
        student_id: "",
        fee_id: "",
        amount: "",
        payment_method: "Cash",
        class_name: "",
    });

    // যখন student সিলেক্ট করবো, তখন তার class অটো আসবে
    const handleStudentChange = (e) => {
        const studentId = e.target.value;
        setData("student_id", studentId);

        const selectedStudent = students.find((s) => s.id == studentId);
        if (selectedStudent) {
            setData("class_name", selectedStudent.schoolClass?.name || "");
        } else {
            setData("class_name", "");
        }
    };

    // যখন fee সিলেক্ট করবো, তখন amount অটো আসবে
    const handleFeeChange = (e) => {
        const feeId = e.target.value;
        setData("fee_id", feeId);

        const selectedFee = fees.find((f) => f.id == feeId);
        if (selectedFee) {
            setData("amount", selectedFee.amount);
        } else {
            setData("amount", "");
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(route("student-fees.store"));
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md">
            <h2 className="text-xl font-bold mb-4">💰 Collect Fee</h2>

            <form onSubmit={submit} className="space-y-4">
                {/* Student */}
                <div>
                    <label className="block font-medium">Student</label>
                    <select
                        value={data.student_id}
                        onChange={handleStudentChange}
                        className="w-full border rounded p-2"
                    >
                        <option value="">-- Select Student --</option>
                        {students.map((student) => (
                            <option key={student.id} value={student.id}>
                                {student.student_name}
                            </option>
                        ))}
                    </select>
                    {errors.student_id && <div className="text-red-600">{errors.student_id}</div>}
                </div>

                {/* Auto Show Class */}
                {data.class_name && (
                    <div>
                        <label className="block font-medium">Class</label>
                        <input
                            type="text"
                            value={data.class_name}
                            readOnly
                            className="w-full border rounded p-2 bg-gray-100"
                        />
                    </div>
                )}

                {/* Fee Type */}
                <div>
                    <label className="block font-medium">Fee Type</label>
                    <select
                        value={data.fee_id}
                        onChange={handleFeeChange}
                        className="w-full border rounded p-2"
                    >
                        <option value="">-- Select Fee --</option>
                        {fees.map((fee) => (
                            <option key={fee.id} value={fee.id}>
                                {fee.name} ({fee.type})
                            </option>
                        ))}
                    </select>
                    {errors.fee_id && <div className="text-red-600">{errors.fee_id}</div>}
                </div>

                {/* Amount */}
                <div>
                    <label className="block font-medium">Amount</label>
                    <input
                        type="number"
                        value={data.amount}
                        onChange={(e) => setData("amount", e.target.value)}
                        className="w-full border rounded p-2"
                    />
                    {errors.amount && <div className="text-red-600">{errors.amount}</div>}
                </div>

                {/* Payment Method */}
                <div>
                    <label className="block font-medium">Payment Method</label>
                    <select
                        value={data.payment_method}
                        onChange={(e) => setData("payment_method", e.target.value)}
                        className="w-full border rounded p-2"
                    >
                        <option value="Cash">Cash</option>
                        <option value="Bkash">Bkash</option>
                        <option value="Bank">Bank</option>
                    </select>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={processing}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Save Payment
                </button>
            </form>
        </div>
    );
};

export default CreateStudentFee;
