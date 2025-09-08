import React, { useState } from "react";
import { useForm } from "@inertiajs/react";

const allMonths = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];
const examTerms = ["1st Terminal", "2nd Terminal", "3rd Terminal"];

const EditStudentFee = ({ student, fees, studentFees }) => {
    const { data, setData, put, processing } = useForm({
        fees: studentFees.map(fee => ({
            id: fee.id,
            fee_id: fee.fee_id,
            paid_amount: fee.paid_amount,
            payment_method: fee.payment_method,
            months: fee.months || [],
        }))
    });

    const handleMonthChange = (index, value) => {
        const newFees = [...data.fees];
        let months = newFees[index].months || [];

        if (months.includes(value)) {
            months = months.filter(m => m !== value);
        } else {
            months.push(value);
        }

        newFees[index].months = months;

        // Update paid_amount for monthly fees
        const feeInfo = fees.find(f => f.id == newFees[index].fee_id);
        if (feeInfo && feeInfo.type !== "one_time") {
            newFees[index].paid_amount = feeInfo.amount * months.length;
        }

        setData("fees", newFees);
    };

    const handleFeeChange = (index, feeId) => {
        const newFees = [...data.fees];
        const feeInfo = fees.find(f => f.id == feeId);
        newFees[index].fee_id = feeId;
        newFees[index].months = [];
        newFees[index].paid_amount = feeInfo.type === "one_time" ? feeInfo.amount : 0;
        setData("fees", newFees);
    };

    const handlePaidAmountChange = (index, value) => {
        const newFees = [...data.fees];
        newFees[index].paid_amount = value;
        setData("fees", newFees);
    };

    const handlePaymentMethodChange = (index, value) => {
        const newFees = [...data.fees];
        newFees[index].payment_method = value;
        setData("fees", newFees);
    };

    const submit = (e) => {
        e.preventDefault();
        put(route("student-fees.updateAll", student.id));
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">✏️ Edit All Student Fees</h1>
            <form onSubmit={submit} className="space-y-4">
                {data.fees.map((fee, index) => {
                    const feeInfo = fees.find(f => f.id == fee.fee_id);
                    return (
                        <div key={index} className="border p-4 rounded space-y-2">
                            <div>
                                <label className="font-semibold">Select Fee</label>
                                <select
                                    value={fee.fee_id}
                                    onChange={(e) => handleFeeChange(index, e.target.value)}
                                    className="border px-3 py-2 rounded w-full"
                                >
                                    <option value="">-- Select Fee --</option>
                                    {fees.map(f => (
                                        <option key={f.id} value={f.id}>
                                            {f.name} ({f.type}) - ৳{f.amount}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Months / Terms */}
                            {feeInfo && feeInfo.type !== "one_time" && (
                                <div>
                                    <label className="font-semibold">
                                        {feeInfo.type === "monthly" ? "Select Months" : "Select Terms"}
                                    </label>
                                    <div className="grid grid-cols-3 gap-2 mt-1">
                                        {(feeInfo.type === "monthly" ? allMonths : examTerms).map(item => (
                                            <label key={item} className="flex items-center space-x-1">
                                                <input
                                                    type="checkbox"
                                                    value={item}
                                                    checked={fee.months.includes(item)}
                                                    onChange={() => handleMonthChange(index, item)}
                                                />
                                                <span>{item}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="font-semibold">Paid Amount</label>
                                <input
                                    type="number"
                                    value={fee.paid_amount}
                                    onChange={(e) => handlePaidAmountChange(index, e.target.value)}
                                    className="border px-3 py-2 rounded w-full"
                                />
                            </div>

                            <div>
                                <label className="font-semibold">Payment Method</label>
                                <select
                                    value={fee.payment_method}
                                    onChange={(e) => handlePaymentMethodChange(index, e.target.value)}
                                    className="border px-3 py-2 rounded w-full"
                                >
                                    <option value="Cash">Cash</option>
                                    <option value="Bkash">Bkash</option>
                                    <option value="Bank">Bank</option>
                                </select>
                            </div>
                        </div>
                    );
                })}

                <button
                    type="submit"
                    disabled={processing}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    {processing ? "Updating..." : "Update All Fees"}
                </button>
            </form>
        </div>
    );
};

export default EditStudentFee;
