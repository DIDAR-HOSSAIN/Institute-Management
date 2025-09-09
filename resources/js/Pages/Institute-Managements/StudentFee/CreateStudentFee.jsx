import React, { useState, useEffect } from "react";
import { useForm } from "@inertiajs/react";

export default function CreateStudentFee({ student, fees, studentFees }) {
    const { data, setData, post, processing, errors } = useForm({
        student_id: student.id,
        tuition_months: [],       // Recurring months
        exams: [],                // Exam fee IDs
        admission: false,         // Admission paid or not
        payment_method: "Cash",
    });

    // Months array
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    // Selected months (checkboxes)
    const [selectedMonths, setSelectedMonths] = useState([]);

    // Selected exams
    const [selectedExams, setSelectedExams] = useState([]);

    // Admission already paid?
    const [admissionPaid, setAdmissionPaid] = useState(false);

    // Populate defaults on load
    useEffect(() => {
        // Tuition months already paid
        const tuitionPaidMonths = studentFees
            .filter(sf => sf.class_fee.fee.name === "Tuition")
            .flatMap(sf => sf.months || []);
        setSelectedMonths(tuitionPaidMonths);
        setData("tuition_months", tuitionPaidMonths);

        // Exams already paid
        const examPaid = studentFees
            .filter(sf => sf.class_fee.fee.name === "Exam")
            .map(sf => sf.class_fee.fee_id);
        setSelectedExams(examPaid);
        setData("exams", examPaid);

        // Admission
        const admissionAlreadyPaid = studentFees.some(sf => sf.class_fee.fee.name === "Admission");
        setAdmissionPaid(admissionAlreadyPaid);
        setData("admission", !admissionAlreadyPaid);
    }, []);

    const toggleMonth = (month) => {
        let updated;
        if (selectedMonths.includes(month)) {
            updated = selectedMonths.filter(m => m !== month);
        } else {
            updated = [...selectedMonths, month];
        }
        setSelectedMonths(updated);
        setData("tuition_months", updated);
    };

    const toggleExam = (feeId) => {
        let updated;
        if (selectedExams.includes(feeId)) {
            updated = selectedExams.filter(id => id !== feeId);
        } else {
            updated = [...selectedExams, feeId];
        }
        setSelectedExams(updated);
        setData("exams", updated);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route("student-fees.store"), {
            data
        });
    };

    // Total tuition amount (per month * selected months)
    const tuitionFee = fees.find(f => f.fee.name === "Tuition")?.amount || 0;
    const totalTuition = tuitionFee * selectedMonths.length;

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md">
            <h2 className="text-xl font-bold mb-4">💰 Collect Fee</h2>
            <p><strong>Student:</strong> {student.student_name}</p>
            <p className="mb-4"><strong>Class:</strong> {student.school_class?.class_name}</p>

            <form onSubmit={submit} className="space-y-6">
                {/* Tuition Fee */}
                <div>
                    <h3 className="font-semibold mb-2">Tuition Fee (per month: {tuitionFee}৳)</h3>
                    <div className="grid grid-cols-3 gap-2">
                        {months.map(m => (
                            <label key={m} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={selectedMonths.includes(m)}
                                    onChange={() => toggleMonth(m)}
                                />
                                <span>{m}</span>
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
                                    onChange={() => toggleExam(cf.fee.id)}
                                />
                                <span>{cf.fee.name} - {cf.amount}৳</span>
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
                            checked={admissionPaid || data.admission}
                            disabled={admissionPaid}
                            onChange={() => setData("admission", !data.admission)}
                        />
                        <span>Admission Fee</span>
                    </label>
                </div>

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
