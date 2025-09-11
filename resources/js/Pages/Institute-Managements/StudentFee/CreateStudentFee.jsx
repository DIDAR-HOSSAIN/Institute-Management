import React, { useState, useEffect, useMemo } from "react";
import { useForm, usePage } from "@inertiajs/react";
import axios from "axios";
import Swal from "sweetalert2";

export default function CreateStudentFee({ student, fees = [], studentFees = [] }) {
    const { flash } = usePage().props;
    const { data, setData, post, processing } = useForm({
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

    // মাসের নাম
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    // Paid states
    const [paidMonths, setPaidMonths] = useState([]);
    const [paidExams, setPaidExams] = useState([]);
    const [admissionAlreadyPaid, setAdmissionAlreadyPaid] = useState(false);

    // Tuition Fee
    const tuitionFee = useMemo(
        () => (loadedFees || []).find(f => f?.fee?.name === "Tuition")?.amount || 0,
        [loadedFees]
    );

    const admissionClassFee = useMemo(
        () => (loadedFees || []).find(f => f?.fee?.name === "Admission"),
        [loadedFees]
    );
    const admissionAmount = Number(admissionClassFee?.amount ?? 0);

    // Paid data load
    useEffect(() => {
        if (!loadedStudentFees.length) return;

        const tuitionPaidMonths = loadedStudentFees
            .filter(sf => sf.class_fee?.fee?.name === "Tuition")
            .flatMap(sf => sf.months || []);
        setPaidMonths(tuitionPaidMonths);

        const examPaid = loadedStudentFees
            .filter(sf => sf.class_fee?.fee?.type === "exam")
            .map(sf => sf.class_fee?.fee_id);
        setPaidExams(examPaid);

        const admissionPaid = loadedStudentFees.some(sf => sf.class_fee?.fee?.name === "Admission");
        setAdmissionAlreadyPaid(admissionPaid);

        setData("student_id", loadedStudent?.id || "");
        setData("tuition_months", tuitionPaidMonths);
        setData("exams", examPaid);
        setData("admission", !admissionPaid);
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
        } catch (err) {
            alert("Student not found!");
        } finally {
            setLoading(false);
        }
    };

    // Submit
    const submit = (e) => {
        e.preventDefault();
        console.log("Submitting Data:", data);

        post(route("student-fees.store"), {
            onSuccess: () => {
                Swal.fire({
                    title: "✅ Success!",
                    text: "Fees recorded successfully!",
                    icon: "success",
                    confirmButtonText: "OK",
                });

                setData("tuition_months", []);
                setData("exams", []);
                setData("admission", false);
            },
            onError: (errors) => {
                Swal.fire({
                    title: "❌ Error!",
                    text: "Something went wrong while saving fees.",
                    icon: "error",
                    confirmButtonText: "OK",
                });
            },
        });
    };


    // Tuition হিসাব
    const totalTuition = tuitionFee * (data.tuition_months?.length || 0);


    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md">
            <h2 className="text-xl font-bold mb-4">💰 Collect Fee</h2>

            {/* 🔍 Search Form */}
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
                    <p className="mb-4"><strong>Class:</strong> {loadedStudent.school_class?.class_name}</p>

                    {/* Tuition */}
                    <div>
                        <h3 className="font-semibold mb-2">
                            Tuition Fee (per month: {tuitionFee}৳)
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
                                                : [...data.tuition_months, m];
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
                            {loadedFees.filter(f => f.fee.type === "exam").map(cf => (
                                <label key={cf.fee.id} className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={data.exams.includes(cf.fee.id)}
                                        disabled={paidExams.includes(cf.fee.id)}
                                        onChange={() => {
                                            if (paidExams.includes(cf.fee.id)) return;
                                            const updated = data.exams.includes(cf.fee.id)
                                                ? data.exams.filter(x => x !== cf.fee.id)
                                                : [...data.exams, cf.fee.id];
                                            setData("exams", updated);
                                        }}
                                    />
                                    <span>
                                        {cf.fee.name} - {cf.amount}৳{" "}
                                        {paidExams.includes(cf.fee.id) && "(Paid)"}
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
                                checked={admissionAlreadyPaid ? true : data.admission}
                                disabled={admissionAlreadyPaid}
                                onChange={() => setData("admission", !data.admission)}
                            />
                            <span>
                                Admission - {admissionAmount}৳{" "}
                                {admissionAlreadyPaid && "(Paid)"}
                            </span>
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                        Save Payments
                    </button>
                </form>
            ) : (
                <p className="text-gray-600">🔍 Please search by Student ID to continue.</p>
            )}
        </div>
    );
}
