import React, { useState, useEffect, useMemo } from "react";
import { useForm } from "@inertiajs/react";
import axios from "axios";
import AdminDashboardLayout from "@/backend/Dashboard/AdminDashboardLayout";

export default function EditStudentFee({
    student,
    fees = [],
    studentFees = [],
    paidTuitionMonths = [],
    paidExams = [],
    admissionPaid = false,
    auth
}) {
    const { data, setData, put } = useForm({
        student_id: student?.id || "",
        tuition_months: paidTuitionMonths || [],
        exams: paidExams || [],
        admission: admissionPaid || false,
        payment_method: "Cash",
    });

    const [loadedStudent, setLoadedStudent] = useState(student);
    const [loadedFees, setLoadedFees] = useState(fees);
    const [loadedStudentFees, setLoadedStudentFees] = useState(studentFees);
    const [paidMonths, setPaidMonths] = useState(paidTuitionMonths || []);
    const [paidExamIds, setPaidExamIds] = useState(paidExams || []);
    const [admissionAlreadyPaid, setAdmissionAlreadyPaid] = useState(admissionPaid || false);
    const [searchId, setSearchId] = useState("");
    const [loading, setLoading] = useState(false);

    const months = useMemo(() => [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ], []);

    const tuitionFee = useMemo(
        () => (loadedFees || []).find(f => f.fee?.name === 'Tuition')?.amount || 0,
        [loadedFees]
    );

    const admissionClassFee = useMemo(
        () => (loadedFees || []).find(f => f.fee?.name === 'Admission'),
        [loadedFees]
    );

    const admissionAmount = Number(admissionClassFee?.amount ?? 0);

    const flattenPayments = (studentFeesPayload) => {
        if (!studentFeesPayload?.length) return [];
        return studentFeesPayload.flatMap(sf => sf.payments || []);
    };

    useEffect(() => {
        if (!loadedStudentFees?.length) {
            setPaidMonths([]);
            setPaidExamIds([]);
            setAdmissionAlreadyPaid(false);
            setData('tuition_months', []);
            setData('exams', []);
            setData('admission', false);
            return;
        }

        const payments = flattenPayments(loadedStudentFees);

        const tuitionPaidMonths = Array.from(new Set(
            payments.filter(p => p.type === 'tuition' && p.month).map(p => p.month)
        ));

        const examPaidIds = Array.from(new Set(
            payments.filter(p => p.type === 'exam').map(p => p.class_fee_id).filter(Boolean)
        ));

        const admissionPaidFlag = payments.some(p => p.type === 'admission');

        setPaidMonths(tuitionPaidMonths);
        setPaidExamIds(examPaidIds);
        setAdmissionAlreadyPaid(admissionPaidFlag);

        setData('tuition_months', tuitionPaidMonths);
        setData('exams', examPaidIds);
        setData('admission', admissionPaidFlag);
    }, [loadedStudentFees, loadedStudent, loadedFees]);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchId) return;
        setLoading(true);
        try {
            const res = await axios.get(`/student-fees/fetch/${searchId}`);
            const s = res.data.student;
            const f = res.data.fees;
            const sf = res.data.studentFees;
            const tuitionMonths = res.data.paidTuitionMonths || [];
            const examIds = res.data.paidExams || [];
            const admissionFlag = res.data.admissionPaid || false;

            setLoadedStudent(s);
            setLoadedFees(f);
            setLoadedStudentFees(sf);

            setPaidMonths(tuitionMonths);
            setPaidExamIds(examIds);
            setAdmissionAlreadyPaid(admissionFlag);

            setData("student_id", s.id);
            setData("tuition_months", tuitionMonths);
            setData("exams", examIds);
            setData("admission", admissionFlag);
        } finally {
            setLoading(false);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        put(route('student-fees.update-all', loadedStudent.id), {
            onSuccess: () => alert("Updated successfully!"),
            onError: (errors) => console.log(errors),
        });
    };

    const totalTuition = tuitionFee * (Array.isArray(data.tuition_months) ? data.tuition_months.length : 0);
    const checkboxStyle = (isPaid) => isPaid ? "text-gray-400" : "text-black";

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
            <h2 className="text-xl font-bold mb-4">💰 Edit Student Fee</h2>

            <form onSubmit={handleSearch} className="mb-4 flex space-x-2">
                <input
                    type="text" value={searchId} onChange={e => setSearchId(e.target.value)}
                    placeholder="Enter Student ID" className="border px-3 py-2 rounded w-full"
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
                        <h3 className="font-semibold mb-2">Tuition Fee ({tuitionFee}৳/month)</h3>
                        <div className="grid grid-cols-3 gap-2">
                            {months.map(m => (
                                <label key={m} className={`flex items-center space-x-2 ${checkboxStyle(paidMonths.includes(m))}`}>
                                    <input
                                        type="checkbox"
                                        checked={Array.isArray(data.tuition_months) && data.tuition_months.includes(m)}
                                        onChange={() => {
                                            const current = Array.isArray(data.tuition_months) ? data.tuition_months : [];
                                            const updated = current.includes(m)
                                                ? current.filter(x => x !== m)
                                                : [...current, m];
                                            setData('tuition_months', updated);
                                        }}
                                    />
                                    <span>{m} {paidMonths.includes(m) && "(Already Paid)"}</span>
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
                                    <label key={cf.id} className={`flex items-center space-x-2 ${checkboxStyle(paidExamIds.includes(cf.id))}`}>
                                        <input
                                            type="checkbox"
                                            checked={Array.isArray(data.exams) && data.exams.includes(cf.id)}
                                            onChange={() => {
                                                const current = Array.isArray(data.exams) ? data.exams : [];
                                                const updated = current.includes(cf.id)
                                                    ? current.filter(x => x !== cf.id)
                                                    : [...current, cf.id];
                                                setData("exams", updated);
                                                setPaidExamIds(updated);
                                            }}
                                        />
                                        <span>
                                            {cf.fee.name} - {Number(cf.amount).toFixed(2)}৳{" "}
                                            {paidExamIds.includes(cf.id) && "(Already Paid)"}
                                        </span>
                                    </label>
                                ))}
                        </div>
                    </div>

                    {/* Admission */}
                    <div>
                        <h3 className="font-semibold mb-2">Admission Fee</h3>
                        <label className={`flex items-center space-x-2 ${checkboxStyle(admissionAlreadyPaid)}`}>
                            <input type="checkbox" checked={!!data.admission} onChange={() => setData('admission', !data.admission)} />
                            <span>Admission - {admissionAmount}৳ {admissionAlreadyPaid && "(Already Paid)"}</span>
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
