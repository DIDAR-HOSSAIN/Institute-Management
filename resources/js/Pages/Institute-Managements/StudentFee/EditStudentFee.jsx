import React, { useEffect, useState } from "react";
import { useForm } from "@inertiajs/react";

const allMonths = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];
const examTerms = ["1st Terminal", "2nd Terminal", "3rd Terminal"];

const EditStudentFee = ({ students, fees, studentFee }) => {
    const { data, setData, put, processing, reset } = useForm({
        student_id: studentFee.student_id || "",
        fee_id: studentFee.fee_id || "",
        months: studentFee.months || [],
        paid_amount: studentFee.paid_amount || 0,
        payment_method: studentFee.payment_method || "Cash",
    });

    const [selectedFee, setSelectedFee] = useState(null);

    // set fee initially
    useEffect(() => {
        if (data.fee_id) {
            const fee = fees.find(f => f.id == data.fee_id);
            setSelectedFee(fee);
        }
    }, [data.fee_id]);

    // handle fee change
    const handleFeeChange = (feeId) => {
        const fee = fees.find(f => f.id == feeId);
        setSelectedFee(fee);
        setData("fee_id", feeId);
        setData("months", []);
        if (fee?.type === "one_time") {
            setData("paid_amount", fee.amount);
        } else {
            setData("paid_amount", 0);
        }
    };

    // handle month/term checkbox change
    const handleMonthChange = (value) => {
        let newMonths = [...data.months];
        if (newMonths.includes(value)) {
            newMonths = newMonths.filter(m => m !== value);
        } else {
            newMonths.push(value);
        }
        setData("months", newMonths);

        if (selectedFee && selectedFee.type !== "one_time") {
            setData("paid_amount", selectedFee.amount * newMonths.length);
        }
    };

    // submit form
    const submit = (e) => {
        e.preventDefault();
        put(route("student-fees.update", studentFee.id), {
            onSuccess: () => reset(),
        });
    };

    return (
        <div className="max-w-3xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">✏️ Edit Student Fee</h1>
            <form onSubmit={submit} className="space-y-4">

                {/* Student Select */}
                <div>
                    <label className="block font-semibold mb-1">Select Student</label>
                    <select
                        value={data.student_id}
                        onChange={(e) => setData("student_id", e.target.value)}
                        className="border rounded px-3 py-2 w-full"
                        required
                    >
                        <option value="">-- Select Student --</option>
                        {students.map(s => (
                            <option key={s.id} value={s.id}>
                                {s.student_name} ({s.roll_number})
                            </option>
                        ))}
                    </select>
                </div>

                {/* Fee Select */}
                <div>
                    <label className="block font-semibold mb-1">Select Fee</label>
                    <select
                        value={data.fee_id}
                        onChange={(e) => handleFeeChange(e.target.value)}
                        className="border rounded px-3 py-2 w-full"
                        required
                    >
                        <option value="">-- Select Fee --</option>
                        {fees.map(f => (
                            <option key={f.id} value={f.id}>
                                {f.name} ({f.type}) - ৳{f.amount}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Months / Terms Selection */}
                {selectedFee && selectedFee.type !== "one_time" && (
                    <div>
                        <label className="block font-semibold mb-1">
                            {selectedFee.type === "monthly" ? "Select Months" : "Select Terms"}
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            {(selectedFee.type === "monthly" ? allMonths : examTerms).map((item) => (
                                <label key={item} className="flex items-center space-x-1">
                                    <input
                                        type="checkbox"
                                        value={item}
                                        checked={data.months.includes(item)}
                                        onChange={() => handleMonthChange(item)}
                                    />
                                    <span>{item}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                )}

                {/* Paid Amount */}
                <div>
                    <label className="block font-semibold mb-1">Paid Amount</label>
                    <input
                        type="number"
                        value={data.paid_amount}
                        readOnly
                        className="border rounded px-3 py-2 w-full bg-gray-100"
                    />
                </div>

                {/* Payment Method */}
                <div>
                    <label className="block font-semibold mb-1">Payment Method</label>
                    <select
                        value={data.payment_method}
                        onChange={(e) => setData("payment_method", e.target.value)}
                        className="border rounded px-3 py-2 w-full"
                    >
                        <option value="Cash">Cash</option>
                        <option value="Bkash">Bkash</option>
                        <option value="Bank">Bank</option>
                    </select>
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    {processing ? "Updating..." : "Update Fees"}
                </button>
            </form>
        </div>
    );
};

export default EditStudentFee;
