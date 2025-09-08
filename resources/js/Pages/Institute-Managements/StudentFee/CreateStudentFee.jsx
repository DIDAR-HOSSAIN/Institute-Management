import React from "react";
import { useForm } from "@inertiajs/react";

export default function CreateStudentFee({ student, fees }) {
    const { data, setData, post, processing, errors } = useForm({
        student_id: student.id,
        payments: [
            { fee_id: "", amount: "", payment_method: "Cash", month: "" }
        ],
    });

    const handlePaymentChange = (index, field, value) => {
        const updatedPayments = [...data.payments];
        updatedPayments[index][field] = value;

        if (field === "fee_id") {
            const fee = fees.find(f => f.fee.id === parseInt(value));
            updatedPayments[index]["amount"] = fee ? fee.amount : "";
        }

        setData("payments", updatedPayments);
    };

    const addPaymentRow = () => {
        setData("payments", [
            ...data.payments,
            { fee_id: "", amount: "", payment_method: "Cash", month: "" },
        ]);
    };

    const removePaymentRow = (index) => {
        setData("payments", data.payments.filter((_, i) => i !== index));
    };

    const submit = (e) => {
        e.preventDefault();
        post(route("student-fees.store"));
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md">
            <h2 className="text-xl font-bold mb-4">💰 Collect Fee</h2>
            <p><strong>Student:</strong> {student.student_name}</p>
            <p className="mb-4"><strong>Class:</strong> {student.school_class?.class_name}</p>

            <form onSubmit={submit} className="space-y-4">
                {data.payments.map((payment, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 items-end">
                        <div className="col-span-3">
                            <label className="block font-medium">Fee Type</label>
                            <select
                                value={payment.fee_id}
                                onChange={(e) => handlePaymentChange(index, "fee_id", e.target.value)}
                                className="w-full border rounded p-2"
                            >
                                <option value="">-- Select Fee --</option>
                                {fees.map((cf) => (
                                    <option key={cf.fee.id} value={cf.fee.id}>
                                        {cf.fee.name} ({cf.fee.type})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="col-span-2">
                            <label className="block font-medium">Month</label>
                            <select
                                value={payment.month}
                                onChange={(e) => handlePaymentChange(index, "month", e.target.value)}
                                className="w-full border rounded p-2"
                            >
                                <option value="">-- Select Month --</option>
                                {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map(m => (
                                    <option key={m} value={m}>{m}</option>
                                ))}
                            </select>
                        </div>

                        <div className="col-span-2">
                            <label className="block font-medium">Amount</label>
                            <input
                                type="number"
                                value={payment.amount}
                                onChange={(e) => handlePaymentChange(index, "amount", e.target.value)}
                                className="w-full border rounded p-2"
                            />
                        </div>

                        <div className="col-span-3">
                            <label className="block font-medium">Payment Method</label>
                            <select
                                value={payment.payment_method}
                                onChange={(e) => handlePaymentChange(index, "payment_method", e.target.value)}
                                className="w-full border rounded p-2"
                            >
                                <option value="Cash">Cash</option>
                                <option value="Bkash">Bkash</option>
                                <option value="Bank">Bank</option>
                            </select>
                        </div>

                        <div className="col-span-2">
                            {index > 0 && (
                                <button type="button"
                                    onClick={() => removePaymentRow(index)}
                                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">
                                    Remove
                                </button>
                            )}
                        </div>
                    </div>
                ))}

                <button
                    type="button"
                    onClick={addPaymentRow}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                    + Add Fee
                </button>

                <button
                    type="submit"
                    disabled={processing}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Save Payments
                </button>
            </form>
        </div>
    );
}
