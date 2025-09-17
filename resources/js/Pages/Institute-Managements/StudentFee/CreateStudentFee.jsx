import React, { useState, useEffect, useMemo } from "react";
import { useForm } from "@inertiajs/react";
import axios from "axios";
import AdminDashboardLayout from "@/backend/Dashboard/AdminDashboardLayout";

export default function CreateStudentFee({ student, fees = [], studentFees = [], auth }) {
    const { data, setData, post } = useForm({
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

    const [paidMonths, setPaidMonths] = useState([]);
    const [paidExams, setPaidExams] = useState([]);
    const [admissionAlreadyPaid, setAdmissionAlreadyPaid] = useState(false);

    const tuitionFee = useMemo(
        () => (loadedFees || []).find(f => f?.fee?.name === "Tuition")?.amount || 0,
        [loadedFees]
    );

    const admissionClassFee = useMemo(
        () => (loadedFees || []).find(f => f?.fee?.name === "Admission"),
        [loadedFees]
    );
    const admissionAmount = Number(admissionClassFee?.amount ?? 0);

    const flattenPayments = (studentFeesPayload) => {
        if (!studentFeesPayload || !studentFeesPayload.length) return [];
        if (studentFeesPayload[0].payments !== undefined) {
            return studentFeesPayload.flatMap(sf => sf.payments || []);
        }
        if (studentFeesPayload[0].type !== undefined) {
            return studentFeesPayload;
        }
        return [];
    };

    useEffect(() => {
        if (!loadedStudentFees || !loadedStudentFees.length) {
            setPaidMonths([]);
            setPaidExams([]);
            setAdmissionAlreadyPaid(false);
            return;
        }

        const payments = flattenPayments(loadedStudentFees);

        // Tuition Paid Months
        const tuitionPaidMonths = Array.from(new Set(
            payments.filter(p => p.type === "tuition" && p.month).map(p => p.month)
        ));

        // Exam Paid IDs
        const examPaidIds = Array.from(new Set(
            payments.filter(p => p.type === "exam")
                .map(p => p.class_fee_id)
                .filter(Boolean)
        ));

        // Admission Paid
        const admissionPaid = payments.some(p => p.type === "admission");

        setPaidMonths(tuitionPaidMonths);
        setPaidExams(examPaidIds);
        setAdmissionAlreadyPaid(admissionPaid);

        // Tuition months (checked only if user selects)
        setData("student_id", loadedStudent?.id || "");
        setData("tuition_months", tuitionPaidMonths);

        // 🔥 Fix: শুধু paid exams রাখব, সব exam auto-check করব না
        setData("exams", examPaidIds);

        // Admission
        setData("admission", !admissionPaid);
    }, [loadedStudentFees, loadedStudent, loadedFees]);


    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchId) return;
        setLoading(true);
        try {
            const res = await axios.get(`/student-fees/fetch/${searchId}`);
            setLoadedStudent(res.data.student);
            setLoadedFees(res.data.fees);
            setLoadedStudentFees(res.data.studentFees || []);
            setData("student_id", res.data.student?.id || "");
        } catch {
            alert("Student not found!");
        } finally {
            setLoading(false);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(route("student-fees.store"));
    };

    const totalTuition = tuitionFee * (data.tuition_months?.length || 0);

    return (
        <AdminDashboardLayout
            user={auth.user}
            header={
                <h1 className="font-semibold text-xl text-gray-800 leading-tight">
                    Manage Students
                </h1>
            }
        >
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md">
            <h2 className="text-xl font-bold mb-4">💰 Collect Fee</h2>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="mb-4 flex space-x-2">
                <input
                    type="text"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    placeholder="Enter Student ID"
                    className="border px-3 py-2 rounded w-full"
                />
                <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded">
                    {loading ? "Searching..." : "Search"}
                </button>
            </form>

            {loadedStudent ? (
                <form onSubmit={submit} className="space-y-6">
                    <p><strong>Student:</strong> {loadedStudent.student_name}</p>
                    <p><strong>Class:</strong> {loadedStudent.school_class?.class_name}</p>

                    {/* Tuition */}
                    <div>
                        <h3 className="font-semibold mb-2">
                            Tuition Fee (per month: {Number(tuitionFee).toFixed(2)}৳)
                        </h3>
                        <div className="grid grid-cols-3 gap-2">
                            {months.map(m => (
                                <label key={m} className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={data.tuition_months?.includes(m)}
                                        disabled={paidMonths.includes(m)}
                                        onChange={() => {
                                            if (paidMonths.includes(m)) return;
                                            const updated = data.tuition_months.includes(m)
                                                ? data.tuition_months.filter(x => x !== m)
                                                : [...(data.tuition_months || []), m];
                                            setData("tuition_months", updated);
                                        }}
                                    />
                                    <span>{m} {paidMonths.includes(m) && "(Paid)"}</span>
                                </label>
                            ))}
                        </div>
                        <p className="mt-1 font-medium">Total Tuition: {totalTuition}৳</p>
                    </div>

                    {/* Exams */}
                    <div>
                        <h3 className="font-semibold mb-2">Exam Fees</h3>
                        <div className="grid grid-cols-2 gap-2">
                            {loadedFees
                                .filter(f => f.fee?.type === "exam")
                                .map(cf => (
                                    <label key={cf.id} className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            checked={data.exams.includes(cf.id)}
                                            disabled={paidExams.includes(cf.id)} // paid হলে disable
                                            onChange={() => {
                                                if (paidExams.includes(cf.id)) return;
                                                const updated = data.exams.includes(cf.id)
                                                    ? data.exams.filter(x => x !== cf.id)
                                                    : [...(data.exams || []), cf.id];
                                                setData("exams", updated);
                                            }}
                                        />
                                        <span>
                                            {cf.fee.name} - {Number(cf.amount).toFixed(2)}৳{" "}
                                            {paidExams.includes(cf.id) && "(Paid)"}
                                        </span>
                                    </label>
                                ))}
                        </div>
                    </div>

                    {/* Admission */}
                    <div>
                        <h3 className="font-semibold mb-2">Admission Fee</h3>
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={admissionAlreadyPaid ? true : !!data.admission}
                                disabled={admissionAlreadyPaid}
                                onChange={() => setData("admission", !data.admission)}
                            />
                            <span>
                                Admission - {admissionAmount}৳{" "}
                                {admissionAlreadyPaid && "(Paid)"}
                            </span>
                        </label>
                    </div>

                    <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                        Save Payments
                    </button>
                </form>
            ) : (
                <p className="text-gray-600">🔍 Please search by Student ID to continue.</p>
            )}
        </div>
    </AdminDashboardLayout>
    );
}
