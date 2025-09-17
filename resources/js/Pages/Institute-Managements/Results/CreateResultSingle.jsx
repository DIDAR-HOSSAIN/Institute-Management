import React, { useState } from "react";
import { useForm } from "@inertiajs/react";
import axios from "axios";
import AdminDashboardLayout from "@/backend/Dashboard/AdminDashboardLayout";

export default function CreateResultSingle({auth}) {
    const [student, setStudent] = useState(null);
    const [exams, setExams] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const { data, setData, post, reset } = useForm({
        student_id: "",
        exam_id: "",
        marks: {}, // {subject_id: marks}
    });

    // =====> এখানে function component-এর ভিতরে আছে <======
    const searchStudent = async () => {
        if (!data.student_id) return alert("Enter Student ID");
        try {
            const res = await axios.get(`/results/fetch-student/${data.student_id}`);
            setStudent(res.data.student);
            setExams(res.data.exams || []);
            setSubjects(res.data.subjects || []);
            setData("exam_id", "");
            setData("marks", {});
        } catch (err) {
            console.error(err);
            alert("Student not found!");
        }
    };

    const handleExamChange = async (examId) => {
        setData('exam_id', examId);

        if (!examId) {
            setData('marks', {});
            return;
        }

        try {
            const res = await axios.get(`/students/${data.student_id}/exam/${examId}/results`);
            setData('marks', res.data.results || {});
            setSubjects(res.data.subjects || []);
        } catch (err) {
            console.error(err);
            alert('Failed to fetch marks for this exam');
            setData('marks', {});
        }
    }

    const handleMarksChange = (subjectId, value) => {
        setData("marks", {
            ...data.marks,
            [subjectId]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/student/results", {
            onSuccess: () => {
                alert("Results saved successfully!");
                reset();
                setStudent(null);
                setData("marks", {});
            },
        });
    };

    return (
        <AdminDashboardLayout
            user={auth.user}
            header={
                <h1 className="font-semibold text-xl text-gray-800 leading-tight">
                    Manage Students
                </h1>
            }
        >
        <div className="max-w-3xl mx-auto bg-white shadow rounded p-6">
            <h2 className="text-xl font-bold mb-4">Single Student Result Entry</h2>

            {/* Search Student */}
            <div className="flex gap-2 mb-4">
                <input
                    type="text"
                    placeholder="Enter Student ID"
                    className="border p-2 rounded flex-1"
                    value={data.student_id}
                    onChange={(e) => setData("student_id", e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            searchStudent(); // ✅ call correctly
                        }
                    }}
                />
                <button
                    type="button"
                    onClick={searchStudent}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Search
                </button>
            </div>

            {/* Student info & Exam */}
            {student && (
                <div className="mb-4 p-3 bg-gray-100 rounded">
                    <p><strong>Name:</strong> {student.name}</p>
                    <p><strong>Class:</strong> {student.class_name}</p>

                    {exams.length > 0 && (
                        <select
                            value={data.exam_id}
                            onChange={(e) => handleExamChange(e.target.value)}
                            className="border px-3 py-2 rounded mt-2 w-full"
                        >
                            <option value="">Select Exam</option>
                            {exams.map((exam) => (
                                <option key={exam.id} value={exam.id}>
                                    {exam.exam_name}
                                </option>
                            ))}
                        </select>
                    )}
                </div>
            )}

            {/* Subjects & Marks */}
            {data.exam_id && subjects.length > 0 && (
                <form onSubmit={handleSubmit} className="space-y-4">
                    {subjects.map((sub) => (
                        <div key={sub.id} className="flex items-center gap-4 mb-2">
                            <label className="w-40">{sub.subject_name}</label>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                className="border rounded px-3 py-1 w-32"
                                value={data.marks[sub.id] ?? ""}
                                onChange={(e) => handleMarksChange(sub.id, e.target.value)}
                            />
                        </div>
                    ))}

                    <button
                        type="submit"
                        className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
                    >
                        Save Results
                    </button>
                </form>
            )}
        </div>
    </AdminDashboardLayout>
    );
}
