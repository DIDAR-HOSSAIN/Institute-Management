import React, { useState } from "react";
import { useForm } from "@inertiajs/react";
import axios from "axios";

export default function ResultEntry() {
    const [studentData, setStudentData] = useState(null);
    const [subjects, setSubjects] = useState([]);
    const [exams, setExams] = useState([]);
    const [previousResults, setPreviousResults] = useState([]);

    const [studentId, setStudentId] = useState("");

    const { data, setData, post, processing, reset } = useForm({
        student_id: "",
        exam_id: "",
        marks: {},
    });

    const searchStudent = async () => {
        if (!studentId) return;

        try {
            const res = await axios.get(`/results/fetch-student/${studentId}`);
            setStudentData(res.data.student);
            setSubjects(res.data.subjects);
            setExams(res.data.exams);
            setPreviousResults(res.data.results);

            setData("student_id", res.data.student.id);

            // পুরনো রেজাল্ট গুলো auto fill করতে exam_id চেক না করলে subjectwise ফিল হবে না
            let marksData = {};
            res.data.results.forEach((result) => {
                marksData[result.subject_id] = result.marks_obtained;
            });
            setData("marks", marksData);
        } catch (err) {
            console.error(err);
            alert("Student not found!");
        }
    };

    const handleMarksChange = (subjectId, value) => {
        setData("marks", {
            ...data.marks,
            [subjectId]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/results", {
            onSuccess: () => reset(),
        });
    };

    return (
        <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Result Entry</h2>

            {/* Search */}
            <div className="flex gap-2 mb-4">
                <input
                    type="text"
                    placeholder="Enter Student ID"
                    className="border p-2 rounded w-1/2"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                />
                <button
                    type="button"
                    onClick={searchStudent}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Search
                </button>
            </div>

            {/* Student Info + Form */}
            {studentData && (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="p-3 bg-gray-100 rounded">
                        <p><strong>Name:</strong> {studentData.student_name}</p>
                        <p><strong>Class:</strong> {studentData.school_class.class_name}</p>
                        <p><strong>Section:</strong> {studentData.section.section_name}</p>
                    </div>

                    {/* Exam Select */}
                    <div>
                        <label className="block font-semibold mb-1">Select Exam</label>
                        <select
                            value={data.exam_id}
                            onChange={(e) => setData("exam_id", e.target.value)}
                            className="border p-2 rounded w-full"
                        >
                            <option value="">-- Select Exam --</option>
                            {exams.map((exam) => (
                                <option key={exam.id} value={exam.id}>
                                    {exam.exam_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Marks Table */}
                    <table className="w-full border mt-4">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border p-2">Subject</th>
                                <th className="border p-2">Marks</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subjects.map((sub) => (
                                <tr key={sub.id}>
                                    <td className="border p-2">{sub.subject_name}</td>
                                    <td className="border p-2">
                                        <input
                                            type="number"
                                            className="border p-2 w-full"
                                            value={data.marks[sub.id] || ""}
                                            onChange={(e) =>
                                                handleMarksChange(sub.id, e.target.value)
                                            }
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <button
                        type="submit"
                        disabled={processing}
                        className="bg-green-500 text-white px-6 py-2 rounded mt-4"
                    >
                        {processing ? "Saving..." : "Save Results"}
                    </button>
                </form>
            )}
        </div>
    );
}
