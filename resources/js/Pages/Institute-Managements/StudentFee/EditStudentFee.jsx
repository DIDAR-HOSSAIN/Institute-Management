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

    const months = useMemo(() => [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ], []);

    // Pre-fill existing payments
    useEffect(() => {
        if (!loadedStudentFees.length) return;

        const tuitionPaidMonths = [];
        const examPaidIds = [];
        let admissionPaid = false;

        loadedStudentFees.forEach(sf => {
            sf.payments?.forEach(p => {
                if (p.type === "tuition" && p.month) {
                    tuitionPaidMonths.push(p.month);
                }
                if (p.type === "exam") {
                    examPaidIds.push(sf.class_fee_id);
                }
                if (p.type === "admission") {
                    admissionPaid = true;
                }
            });
        });

        setData("tuition_months", tuitionPaidMonths);
        setData("exams", examPaidIds);
        setData("admission", !admissionPaid); // only enable checkbox if not paid
        setData("student_id", loadedStudent?.id || "");
    }, [loadedStudentFees, loadedStudent]);

    // Search student by ID
    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchId) return;

        setLoading(true);
        try {
            const res = await axios.get(`/student-fees/fetch/${searchId}`);
            setLoadedStudent(res.data.student);
            setLoadedFees(res.data.fees);
            setLoadedStudentFees(res.data.studentFees);
            setData("student_id", res.data.student?.id || "");
        } catch {
            Swal.fire("❌ Error", "Student not found!", "error");
        } finally {
            setLoading(false);
        }
    };

    // Submit updated fees
    const submit = (e) => {
        e.preventDefault();

        const feesToSend = [];

        // Tuition
        const tuitionFeeObj = loadedFees.find(f => f.fee?.name === "Tuition");
        data.tuition_months.forEach(month => {
            if (tuitionFeeObj) {
                feesToSend.push({
                    fee_id: tuitionFeeObj.fee_id,
                    paid_amount: tuitionFeeObj.amount,
                    payment_method: data.payment_method,
                    months: [month],
                });
            }
        });

        // Exams
        data.exams.forEach(examId => {
            const examFee = loadedFees.find(f => f.id === examId || f.fee?.id === examId);
            if (examFee) {
                feesToSend.push({
                    fee_id: examFee.fee_id || examId,
                    paid_amount: examFee.amount,
                    payment_method: data.payment_method,
                    months: [],
                });
            }
        });

        // Admission
        if (data.admission) {
            const admissionFeeObj = loadedFees.find(f => f.fee?.name === "Admission");
            if (admissionFeeObj) {
                feesToSend.push({
                    fee_id: admissionFeeObj.fee_id,
                    paid_amount: admissionFeeObj.amount,
                    payment_method: data.payment_method,
                    months: [],
                });
            }
        }

        if (!feesToSend.length) {
            Swal.fire("❌ Error", "Please select at least one fee!", "error");
            return;
        }

        console.log("Submitting fees:", feesToSend);

        put(
            route("student-fees.update-all", loadedStudent?.id),
            { fees: feesToSend },
            {
                preserveScroll: true,
                onSuccess: () => Swal.fire("✅ Success", "Fees updated successfully!", "success"),
                onError: (errors) => Swal.fire("❌ Error", Object.values(errors).flat().join("\n"), "error"),
            }
        );
    };

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

            {/* Form */}
            {loadedStudent && (
                <form onSubmit={submit} className="space-y-6">
                    <p><strong>Student:</strong> {loadedStudent.student_name}</p>
                    <p><strong>Class:</strong> {loadedStudent.schoolClass?.class_name}</p>

                    {/* Tuition */}
                    <div>
                        <h3>Tuition Fee</h3>
                        <div className="grid grid-cols-3 gap-2">
                            {months.map(month => {
                                const isPaid = data.tuition_months.includes(month);
                                return (
                                    <label key={month} className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            checked={isPaid}
                                            disabled={isPaid} // paid months disabled
                                            onChange={() => {
                                                const updated = data.tuition_months.includes(month)
                                                    ? data.tuition_months.filter(m => m !== month)
                                                    : [...data.tuition_months, month];
                                                setData("tuition_months", updated);
                                            }}
                                        />
                                        <span>{month} {isPaid && "(Paid)"}</span>
                                    </label>
                                )
                            })}
                        </div>
                    </div>

                    {/* Exams */}
                    <div>
                        <h3>Exam Fees</h3>
                        <div className="grid grid-cols-2 gap-2">
                            {loadedFees.filter(f => f.fee?.type === "exam").map(cf => {
                                const isPaid = data.exams.includes(cf.id);
                                return (
                                    <label key={cf.id} className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            checked={isPaid}
                                            disabled={isPaid}
                                            onChange={() => {
                                                const updated = data.exams.includes(cf.id)
                                                    ? data.exams.filter(x => x !== cf.id)
                                                    : [...data.exams, cf.id];
                                                setData("exams", updated);
                                            }}
                                        />
                                        <span>{cf.fee.name} - {cf.amount}৳ {isPaid && "(Paid)"}</span>
                                    </label>
                                )
                            })}
                        </div>
                    </div>

                    {/* Admission */}
                    <div>
                        <h3>Admission Fee</h3>
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={data.admission}
                                disabled={!data.admission} // disable if already paid
                                onChange={() => setData("admission", !data.admission)}
                            />
                            <span>
                                Admission - {loadedFees.find(f => f.fee?.name === "Admission")?.amount || 0}৳
                                {!data.admission && " (Paid)"}
                            </span>
                        </label>
                    </div>

                    {/* Payment Method */}
                    <div>
                        <label>Payment Method:</label>
                        <select className="border px-2 py-1 rounded" value={data.payment_method} onChange={e => setData("payment_method", e.target.value)}>
                            <option value="Cash">Cash</option>
                            <option value="Bkash">Bkash</option>
                            <option value="Bank">Bank</option>
                        </select>
                    </div>

                    <button type="submit" disabled={processing} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                        Update Fees
                    </button>
                </form>
            )}
        </div>
    );
}
