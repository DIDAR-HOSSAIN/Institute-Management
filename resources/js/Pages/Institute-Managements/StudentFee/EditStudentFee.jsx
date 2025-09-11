import React, { useState, useEffect, useMemo } from "react";
import { useForm } from "@inertiajs/react";
import axios from "axios";
import Swal from "sweetalert2";

export default function EditStudentFee({ student, fees = [], studentFees = [] }) {
    const { data, setData, put, processing } = useForm({
        student_id: student?.id || "",
        tuition_months: [],
        exams: [],
        admission: false,
        payment_method: "Cash",
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

    const tuitionFee = useMemo(() =>
        loadedFees.find(f => f.fee?.name === "Tuition")?.amount || 0,
        [loadedFees]
    );

    const admissionFee = useMemo(() =>
        loadedFees.find(f => f.fee?.name === "Admission")?.amount || 0,
        [loadedFees]
    );

    // Load student existing fees
    useEffect(() => {
        if (!loadedStudentFees.length) return;

        const tuitionPaidMonths = loadedStudentFees
            .filter(sf => sf.class_fee?.fee?.name === "Tuition")
            .flatMap(sf => sf.months || []);

        const examPaidIds = loadedStudentFees
            .filter(sf => sf.class_fee?.fee?.type === "exam")
            .map(sf => sf.class_fee?.fee_id);

        const admissionPaid = loadedStudentFees
            .some(sf => sf.class_fee?.fee?.name === "Admission");

        setData("tuition_months", tuitionPaidMonths);
        setData("exams", examPaidIds);
        setData("admission", admissionPaid);
    }, [loadedStudentFees]);

    // Search student
    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchId) return;

        setLoading(true);
        try {
            const res = await axios.get(`/student-fees/fetch/${searchId}`);
            setLoadedStudent(res.data.student);
            setLoadedFees(res.data.fees);
            setLoadedStudentFees(res.data.studentFees);
        } catch {
            Swal.fire("❌ Error", "Student not found!", "error");
        } finally {
            setLoading(false);
        }
    };

    // Submit
    const submit = (e) => {
        e.preventDefault();

        const feesToSend = [];

        // Tuition
        data.tuition_months.forEach(month => {
            const feeId = loadedFees.find(f => f.fee?.name === "Tuition")?.fee_id;
            if (feeId) {
                feesToSend.push({
                    fee_id: feeId,
                    paid_amount: tuitionFee,
                    payment_method: data.payment_method,
                    months: [month],
                });
            }
        });

        // Exams
        data.exams.forEach(examId => {
            const examFee = loadedFees.find(f => f.fee?.id === examId || f.id === examId);
            if (examFee) {
                feesToSend.push({
                    fee_id: examId,
                    paid_amount: examFee.amount,
                    payment_method: data.payment_method,
                });
            }
        });

        // Admission
        if (data.admission) {
            const admissionFeeId = loadedFees.find(f => f.fee?.name === "Admission")?.fee_id;
            if (admissionFeeId) {
                feesToSend.push({
                    fee_id: admissionFeeId,
                    paid_amount: admissionFee,
                    payment_method: data.payment_method,
                });
            }
        }

        if (!feesToSend.length) {
            Swal.fire("❌ Error", "Please select at least one fee!", "error");
            return;
        }

        // ✅ Correct put
        // ✅ Correct put
        put(
            route("student-fees.update-all", loadedStudent?.id),
            {
                fees: feesToSend,
                class_id: loadedStudent?.school_class?.id || loadedStudent?.class_id, // 🔥 Add this
            },
            {
                preserveScroll: true,
                onSuccess: () => Swal.fire("✅ Success", "Fees updated successfully!", "success"),
                onError: (errors) => Swal.fire("❌ Error", Object.values(errors).flat().join("\n"), "error"),
            }
        );

    };

    // Totals
    const totalTuition = tuitionFee * data.tuition_months.length;


    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md">
            <h2 className="text-xl font-bold mb-4">✏️ Edit Student Fee</h2>

            {/* Search */}
            <form onSubmit={handleSearch} className="mb-4 flex space-x-2">
                <input type="text" value={searchId} onChange={e => setSearchId(e.target.value)} placeholder="Enter Student ID" className="border px-3 py-2 rounded w-full" />
                <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded">
                    {loading ? "Searching..." : "Search"}
                </button>
            </form>

            {loadedStudent && (
                <form onSubmit={submit} className="space-y-6">
                    <p><strong>Student:</strong> {loadedStudent.student_name}</p>
                    <p><strong>Class:</strong> {loadedStudent.school_class?.class_name}</p>

                    {/* Tuition */}
                    <div>
                        <h3>Tuition Fee ({tuitionFee}৳/month)</h3>
                        <div className="grid grid-cols-3 gap-2">
                            {months.map(month => (
                                <label key={month} className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={data.tuition_months.includes(month)}
                                        onChange={() => {
                                            const updated = data.tuition_months.includes(month)
                                                ? data.tuition_months.filter(m => m !== month)
                                                : [...data.tuition_months, month];
                                            setData("tuition_months", updated);
                                        }}
                                    />
                                    <span>{month}</span>
                                </label>
                            ))}
                        </div>
                        <p>Total Tuition: {totalTuition}৳</p>
                    </div>

                    {/* Exams */}
                    <div>
                        <h3>Exam Fees</h3>
                        <div className="grid grid-cols-2 gap-2">
                            {loadedFees.filter(f => (f.fee?.type || f.type) === "exam").map(cf => (
                                <label key={cf.fee?.id || cf.id} className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={data.exams.includes(cf.fee?.id || cf.id)}
                                        onChange={() => {
                                            const id = cf.fee?.id || cf.id;
                                            const updated = data.exams.includes(id)
                                                ? data.exams.filter(x => x !== id)
                                                : [...data.exams, id];
                                            setData("exams", updated);
                                        }}
                                    />
                                    <span>{cf.fee?.name || cf.name} - {cf.amount}৳</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Admission */}
                    <div>
                        <label className="flex items-center space-x-2">
                            <input type="checkbox" checked={data.admission} onChange={e => setData("admission", e.target.checked)} />
                            <span>Admission Fee - {admissionFee}৳</span>
                        </label>
                    </div>

                    {/* Payment Method */}
                    <div>
                        <select value={data.payment_method} onChange={e => setData("payment_method", e.target.value)} className="border px-3 py-2 rounded w-full">
                            <option value="Cash">Cash</option>
                            <option value="Bkash">Bkash</option>
                            <option value="Bank">Bank</option>
                        </select>
                    </div>

                    <button type="submit" disabled={processing} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                        Update Payments
                    </button>
                </form>
            )}
        </div>
    );
}
