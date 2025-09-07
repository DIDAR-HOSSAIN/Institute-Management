import React, { useEffect, useState } from "react";
import { useForm } from "@inertiajs/react";

const allMonths = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const examTerms = ["1st Terminal", "2nd Terminal", "3rd Terminal"];

const CreateStudentFee = ({ students, fees, paidMonths }) => {
    const { data, setData, post, processing, reset } = useForm({
        student_id: "",
        fee_id: "",
        months: [],
        paid_amount: 0,
        payment_method: "Cash",
    });

    const [selectedFee, setSelectedFee] = useState(null);
    const [alreadyPaid, setAlreadyPaid] = useState([]);

    // Update selected fee
    const handleFeeChange = (feeId) => {
        const fee = fees.find(f => f.id == feeId);
        setSelectedFee(fee);
        setData("fee_id", feeId);
        setData("months", []);
        if (fee) {
            setData("paid_amount", fee.type === "one_time" ? fee.amount : 0);
        }
    };

    // Update selected months/terms
    const handleMonthChange = (value) => {
        let newMonths = [...data.months];
        if (newMonths.includes(value)) {
            newMonths = newMonths.filter(m => m !== value);
        } else {
            newMonths.push(value);
        }
        setData("months", newMonths);

        if (selectedFee) {
            setData("paid_amount", selectedFee.amount * newMonths.length);
        }
    };

    // Update already paid months/terms on student select
    useEffect(() => {
        if (data.student_id && selectedFee) {
            const studentPaid = paidMonths[data.student_id] || {};
            const feePaid = studentPaid[selectedFee.id] || [];
            setAlreadyPaid(feePaid);
        } else {
            setAlreadyPaid([]);
        }
        setData("months", []);
        if (selectedFee?.type === "one_time") setData("paid_amount", selectedFee?.amount || 0);
        else setData("paid_amount", 0);
    }, [data.student_id, selectedFee]);

    const submit = (e) => {
        e.preventDefault();
        post(route("student-fees.store"), {
            onSuccess: () => reset()
        });
    };

    return (
        <div className="max-w-3xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">💰 Student Fee Collection</h1>
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
                                        disabled={alreadyPaid.includes(item)}
                                    />
                                    <span className={alreadyPaid.includes(item) ? "line-through text-gray-400" : ""}>
                                        {item} {alreadyPaid.includes(item) ? "(Paid)" : ""}
                                    </span>
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
                    {processing ? "Saving..." : "Save Fees"}
                </button>
            </form>
        </div>
    );
};

export default CreateStudentFee;
