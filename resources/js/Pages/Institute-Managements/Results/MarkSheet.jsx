import React, { useRef } from "react";
import { Head } from "@inertiajs/react";
import { useReactToPrint } from "react-to-print";
import AdminDashboardLayout from "@/backend/Dashboard/AdminDashboardLayout";

// গ্রেড বের করার হেল্পার ফাংশন
const getGradeAndGPA = (marks, fullMark) => {
    const percentage = (marks / fullMark) * 100;
    if (percentage >= 80) return { grade: "A+", gpa: 5.0 };
    if (percentage >= 70) return { grade: "A", gpa: 4.0 };
    if (percentage >= 60) return { grade: "A-", gpa: 3.5 };
    if (percentage >= 50) return { grade: "B", gpa: 3.0 };
    if (percentage >= 40) return { grade: "C", gpa: 2.0 };
    if (percentage >= 33) return { grade: "D", gpa: 1.0 };
    return { grade: "F", gpa: 0.0 };
};

export default function Marksheet({ student, exam, results, studentRank, allStudents, auth }) {
    const componentRef = useRef();

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: `${student.student_name}-Marksheet`,
    });

    // মোট নম্বর
    const totalMarks = results.reduce((sum, r) => sum + Number(r.marks_obtained), 0);

    // GPA হিসাব
    const gpaList = results.map((r) =>
        getGradeAndGPA(Number(r.marks_obtained), r.subject.full_mark).gpa
    );
    const finalGPA = gpaList.length
        ? (gpaList.reduce((a, b) => a + b, 0) / gpaList.length).toFixed(2)
        : 0;

    // কোনো সাবজেক্টে ফেল আছে কিনা
    const hasFail = results.some(
        (r) => Number(r.marks_obtained) < Number(r.subject.pass_mark)
    );

    return (
        <AdminDashboardLayout
            user={auth.user}
            header={
                <h1 className="font-semibold text-xl text-gray-800 leading-tight">
                    Mark Sheet Generate
                </h1>
            }
        >
        <div className="max-w-4xl mx-auto">
            <Head title="Marksheet" />

            <div className="text-right mb-4">
                <button
                    onClick={handlePrint}
                    className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
                >
                    Download PDF
                </button>
            </div>

            <div ref={componentRef} className="bg-white p-8 rounded-lg">
                <h1 className="text-2xl font-bold text-center mb-4">
                    {exam.exam_name} - Marksheet
                </h1>

                <div className="mb-6">
                    <p><strong>Student:</strong> {student.student_name}</p>
                    <p><strong>Class:</strong> {student.school_class?.class_name}</p>
                    <p><strong>Roll:</strong> {student.roll_number}</p>
                </div>

                <table className="w-full border-collapse border border-gray-400">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border px-2 py-1">Subject</th>
                            <th className="border px-2 py-1">Full Marks</th>
                            <th className="border px-2 py-1">Pass Marks</th>
                            <th className="border px-2 py-1">Obtained Marks</th>
                            <th className="border px-2 py-1">Grade</th>
                            <th className="border px-2 py-1">GPA</th>
                            <th className="border px-2 py-1">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map((r) => {
                            const { grade, gpa } = getGradeAndGPA(Number(r.marks_obtained), r.subject.full_mark);
                            return (
                                <tr key={r.id}>
                                    <td className="border px-2 py-1">{r.subject.subject_name}</td>
                                    <td className="border px-2 py-1">{r.subject.full_mark}</td>
                                    <td className="border px-2 py-1">{r.subject.pass_mark}</td>
                                    <td className="border px-2 py-1">{r.marks_obtained}</td>
                                    <td className="border px-2 py-1">{grade}</td>
                                    <td className="border px-2 py-1">{gpa.toFixed(2)}</td>
                                    <td className="border px-2 py-1">
                                        {r.marks_obtained >= r.subject.pass_mark ? (
                                            <span className="text-green-600 font-bold">Pass</span>
                                        ) : (
                                            <span className="text-red-600 font-bold">Fail</span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                <div className="mt-6 text-right space-y-2">
                    <p><strong>Total Marks: </strong> {totalMarks}</p>
                    <p><strong>Final GPA: </strong> {finalGPA}</p>
                    <p><strong>Final Grade: </strong> {getGradeAndGPA(finalGPA * 20, 100).grade}</p>
                    <p><strong>Final Status: </strong> {hasFail ? (
                        <span className="text-red-600 font-bold">Fail</span>
                    ) : (
                        <span className="text-green-600 font-bold">Pass</span>
                    )}</p>
                    {studentRank && (
                        <p><strong>Rank: </strong> {studentRank} / {allStudents.length}</p>
                    )}
                </div>
            </div>
        </div>
        </AdminDashboardLayout>
    );
}
