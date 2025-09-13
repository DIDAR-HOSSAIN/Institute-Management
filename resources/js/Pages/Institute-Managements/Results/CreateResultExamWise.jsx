import React, { useState, useEffect } from "react";
import { useForm, router } from "@inertiajs/react";

export default function ResultEntryForm({ classes, exams, subjects, students }) {
    const { data, setData, post } = useForm({
        exam_id: "",
        results: {}, // { student_id: { subject_id: marks } }
    });

    const handleMarksChange = (studentId, subjectId, value) => {
        setData("results", {
            ...data.results,
            [studentId]: {
                ...data.results[studentId],
                [subjectId]: value,
            },
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("results.store")); // backend এ route বানাতে হবে
    };

    return (
        <div className="p-6 bg-white shadow rounded-lg">
            <h2 className="text-xl font-bold mb-4">Result Entry</h2>

            {/* Exam Select */}
            <div className="mb-4">
                <label className="block mb-1 font-medium">Select Exam</label>
                <select
                    value={data.exam_id}
                    onChange={(e) => setData("exam_id", e.target.value)}
                    className="border rounded px-3 py-2 w-full"
                >
                    <option value="">-- Select Exam --</option>
                    {exams.map((exam) => (
                        <option key={exam.id} value={exam.id}>
                            {exam.exam_name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Table */}
            {data.exam_id && (
                <form onSubmit={handleSubmit}>
                    <table className="w-full border">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border px-2 py-1">Student</th>
                                {subjects.map((subject) => (
                                    <th key={subject.id} className="border px-2 py-1">
                                        {subject.subject_name}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {students?.map((student) => (
                                <tr key={student.id}>
                                    <td className="border px-2 py-1">{student.student_name}</td>
                                    {subjects.map((subject) => (
                                        <td key={subject.id} className="border px-2 py-1">
                                            <input
                                                type="number"
                                                className="w-20 border rounded px-2 py-1"
                                                value={
                                                    data.results[student.id]?.[subject.id] || ""
                                                }
                                                onChange={(e) =>
                                                    handleMarksChange(
                                                        student.id,
                                                        subject.id,
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <button
                        type="submit"
                        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Save Results
                    </button>
                </form>
            )}
        </div>
    );
}
