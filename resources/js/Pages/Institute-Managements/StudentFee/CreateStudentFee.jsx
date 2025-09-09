import React, { useState, useEffect, useMemo } from "react";
import { useForm } from "@inertiajs/react";

export default function CreateStudentFee({ student, fees = [], studentFees = [] }) {
    const { data, setData, post, processing } = useForm({
        student_id: student.id,
        tuition_months: [],       // Recurring months
        exams: [],                // Exam fee IDs
        admission: false,         // Admission paid or not
        payment_method: "Cash",
    });

    // মাসের নাম
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    // State
    const [selectedMonths, setSelectedMonths] = useState([]);
    const [selectedExams, setSelectedExams] = useState([]);
    const [paidMonths, setPaidMonths] = useState([]);
    const [paidExams, setPaidExams] = useState([]);
    const [admissionAlreadyPaid, setAdmissionAlreadyPaid] = useState(false);

    // Tuition, Exam, Admission fees বের করা
    const tuitionFee = useMemo(
        () => (fees || []).find(f => f?.fee?.name === "Tuition")?.amount || 0,
        [fees]
    );

    const admissionClassFee = useMemo(
        () => (fees || []).find(f => f?.fee?.name === "Admission"),
        [fees]
    );
    const admissionAmount = Number(admissionClassFee?.amount ?? 0);

    // // useEffect → পূর্বের ডাটা লোড
    // useEffect(() => {
    //     // Tuition paid months
    //     const tuitionPaidMonths = studentFees
    //         .filter(sf => sf.class_fee?.fee?.name === "Tuition")
    //         .flatMap(sf => sf.months || []);
    //     setPaidMonths(tuitionPaidMonths);

    //     // Exams paid
    //     const examPaid = studentFees
    //         .filter(sf => sf.class_fee?.fee?.name === "Exam")
    //         .map(sf => sf.class_fee?.fee_id);
    //     setPaidExams(examPaid);

    //     // Admission paid
    //     const admissionPaid = studentFees.some(sf => sf.class_fee?.fee?.name === "Admission");
    //     setAdmissionAlreadyPaid(admissionPaid);

    //     // ডিফল্ট সেট করা
    //     setSelectedMonths(tuitionPaidMonths);
    //     setData("tuition_months", tuitionPaidMonths);

    //     setSelectedExams(examPaid);
    //     setData("exams", examPaid);

    //     setData("admission", !admissionPaid);
    // }, [studentFees]);

    useEffect(() => {
        const tuitionPaidMonths = studentFees
            .filter(sf => sf.class_fee?.fee?.name === "Tuition")
            .flatMap(sf => sf.months || []);
        console.log("Paid Tuition Months:", tuitionPaidMonths); // ✅ চেক করুন
        setPaidMonths(tuitionPaidMonths);

        const examPaid = studentFees
            .filter(sf => sf.class_fee?.fee?.name === "Exam")
            .map(sf => sf.class_fee?.fee_id);
        console.log("Paid Exams:", examPaid); // ✅ চেক করুন
        setPaidExams(examPaid);

        const admissionPaid = studentFees.some(sf => sf.class_fee?.fee?.name === "Admission");
        console.log("Admission Already Paid:", admissionPaid); // ✅ চেক করুন
        setAdmissionAlreadyPaid(admissionPaid);

        setSelectedMonths(tuitionPaidMonths);
        setData("tuition_months", tuitionPaidMonths);

        setSelectedExams(examPaid);
        setData("exams", examPaid);

        setData("admission", !admissionPaid);
    }, [studentFees]);


    // Toggle Tuition Month
    const toggleMonth = (month) => {
        if (paidMonths.includes(month)) return; // already paid
        let updated;
        if (selectedMonths.includes(month)) {
            updated = selectedMonths.filter(m => m !== month);
        } else {
            updated = [...selectedMonths, month];
        }
        setSelectedMonths(updated);
        setData("tuition_months", updated);
    };

    // Toggle Exam
    const toggleExam = (feeId) => {
        if (paidExams.includes(feeId)) return; // already paid
        let updated;
        if (selectedExams.includes(feeId)) {
            updated = selectedExams.filter(id => id !== feeId);
        } else {
            updated = [...selectedExams, feeId];
        }
        setSelectedExams(updated);
        setData("exams", updated);
    };

    // Submit
    const submit = (e) => {
        e.preventDefault();
        post(route("student-fees.store"), { data });
    };

    // Tuition হিসাব
    const totalTuition = tuitionFee * selectedMonths.filter(m => !paidMonths.includes(m)).length;

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md">
            <h2 className="text-xl font-bold mb-4">💰 Collect Fee</h2>
            <p><strong>Student:</strong> {student.student_name}</p>
            <p className="mb-4"><strong>Class:</strong> {student.school_class?.class_name}</p>

            <form onSubmit={submit} className="space-y-6">
                {/* Tuition Fee */}
                <div>
                    <h3 className="font-semibold mb-2">
                        Tuition Fee (per month: {tuitionFee}৳)
                    </h3>
                    <div className="grid grid-cols-3 gap-2">
                        {months.map(m => (
                            <label key={m} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={selectedMonths.includes(m)}
                                    disabled={paidMonths.includes(m)}
                                    onChange={() => toggleMonth(m)}
                                />
                                <span>
                                    {m} {paidMonths.includes(m) && "(Paid)"}
                                </span>
                            </label>
                        ))}
                    </div>
                    <p className="mt-1 font-medium">Total Tuition: {totalTuition}৳</p>
                </div>

                {/* Exam Fees */}
                <div>
                    <h3 className="font-semibold mb-2">Exam Fees</h3>
                    <div className="grid grid-cols-2 gap-2">
                        {fees.filter(f => f.fee.name === "Exam").map(cf => (
                            <label key={cf.fee.id} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={selectedExams.includes(cf.fee.id)}
                                    disabled={paidExams.includes(cf.fee.id)}
                                    onChange={() => toggleExam(cf.fee.id)}
                                />
                                <span>
                                    {cf.fee.name} - {cf.amount}৳{" "}
                                    {paidExams.includes(cf.fee.id) && "(Paid)"}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Admission Fee */}
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

                {/* Submit */}
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
