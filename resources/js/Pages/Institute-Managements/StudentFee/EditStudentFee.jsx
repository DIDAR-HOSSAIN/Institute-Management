import React, { useState, useEffect, useMemo } from "react";
import { useForm } from "@inertiajs/react";
import axios from "axios";
import Swal from "sweetalert2";

export default function EditStudentFee({ student = null, fees = [], studentFees = [] }) {
    const { data, setData, put, processing } = useForm({
        class_id: student?.school_class_id || "",
        fees: [],
    });

    const [loadedStudent, setLoadedStudent] = useState(student);
    const [loadedFees, setLoadedFees] = useState(fees);
    const [loadedStudentFees, setLoadedStudentFees] = useState(studentFees);

    const [searchId, setSearchId] = useState("");
    const [loading, setLoading] = useState(false);

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    // Load studentFees → set default form state
    useEffect(() => {
        if (!loadedStudent || !loadedFees.length) return;

        const formattedFees = loadedFees.map(f => {
            const sf = loadedStudentFees.find(s => s.class_fee?.fee_id === f.id);
            return {
                fee_id: f.id,
                paid_amount: sf?.total_paid || 0,
                payment_method: sf?.payment_method || "Cash",
                months: sf?.months || [],
            };
        });

        setData("class_id", loadedStudent?.school_class_id || "");
        setData("fees", formattedFees);
    }, [loadedStudent, loadedFees, loadedStudentFees]);

    // Student search
    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchId) return;
        setLoading(true);
        try {
            const res = await axios.get(`/student-fees/fetch/${searchId}`);
            setLoadedStudent(res.data.student);
            setLoadedFees(res.data.fees.map(f => f.fee)); // শুধু fee টেনে আনলাম
            setLoadedStudentFees(res.data.studentFees);
        } catch {
            Swal.fire("❌ Error", "Student not found!", "error");
        } finally {
            setLoading(false);
        }
    };

    // Month toggle
    const handleMonthToggle = (feeIndex, month) => {
        const updatedFees = [...data.fees];
        const fee = updatedFees[feeIndex];
        if (fee.months.includes(month)) {
            fee.months = fee.months.filter(m => m !== month);
        } else {
            fee.months.push(month);
        }
        setData("fees", updatedFees);
    };

    // Submit
    const submit = (e) => {
        e.preventDefault();
        put(route("student-fees.update-all", loadedStudent?.id), {
            data,
            onSuccess: () => Swal.fire("✅ Success", "Fees updated successfully!", "success"),
            onError: (errors) => {
                const msg = Object.values(errors).flat().join("\n");
                Swal.fire("❌ Error", msg, "error");
            }
        });
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md">
            <h2 className="text-xl font-bold mb-4">✏️ Edit Student Fees</h2>

            {/* 🔍 Search */}
            <form onSubmit={handleSearch} className="mb-4 flex space-x-2">
                <input
                    type="text"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    placeholder="Enter Student ID"
                    className="border px-3 py-2 rounded w-full"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    {loading ? "Searching..." : "Search"}
                </button>
            </form>

            {loadedStudent ? (
                <form onSubmit={submit} className="space-y-6">
                    <p><strong>Student:</strong> {loadedStudent.student_name}</p>
                    <p><strong>Class:</strong> {loadedStudent.school_class?.class_name}</p>

                    {data.fees.map((fee, index) => {
                        const feeInfo = loadedFees.find(f => f.id === fee.fee_id);
                        return (
                            <div key={fee.fee_id} className="border p-4 rounded">
                                <h3 className="font-semibold mb-2">
                                    {feeInfo?.name} - {feeInfo?.amount}৳
                                </h3>

                                {feeInfo?.type === "tuition" && (
                                    <div className="grid grid-cols-3 gap-2">
                                        {months.map(m => (
                                            <label key={m} className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    checked={fee.months.includes(m)}
                                                    onChange={() => handleMonthToggle(index, m)}
                                                />
                                                <span>{m}</span>
                                            </label>
                                        ))}
                                    </div>
                                )}

                                <div className="mt-2">
                                    <label className="block mb-1">Paid Amount</label>
                                    <input
                                        type="number"
                                        value={fee.paid_amount}
                                        onChange={(e) => {
                                            const updated = [...data.fees];
                                            updated[index].paid_amount = e.target.value;
                                            setData("fees", updated);
                                        }}
                                        className="border px-3 py-2 rounded w-full"
                                    />
                                </div>

                                <div className="mt-2">
                                    <label className="block mb-1">Payment Method</label>
                                    <select
                                        value={fee.payment_method}
                                        onChange={(e) => {
                                            const updated = [...data.fees];
                                            updated[index].payment_method = e.target.value;
                                            setData("fees", updated);
                                        }}
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
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                        Update Payments
                    </button>
                </form>
            ) : (
                <p className="text-gray-600">🔍 Please search by Student ID to continue.</p>
            )}
        </div>
    );
}
