import React, { useState } from "react";
import { usePage, router, Link } from "@inertiajs/react";

const ViewResult = () => {
    const { results, exams, filters, auth } = usePage().props;

    const [search, setSearch] = useState(filters.search || "");
    const [examId, setExamId] = useState(filters.exam_id || "");
    const [perPage, setPerPage] = useState(filters.per_page || 20);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route("results.index"), {
            search,
            exam_id: examId,
            per_page: perPage,
        }, { preserveState: true });
    };

    const handlePerPageChange = (e) => {
        setPerPage(e.target.value);
        router.get(route("results.index"), {
            search,
            exam_id: examId,
            per_page: e.target.value,
        }, { preserveState: true });
    };

    return (
        <AdminDashboardLayout
            user={auth.user}
            header={
                <h1 className="font-semibold text-xl text-gray-800 leading-tight">
                    Manage Results
                </h1>
            }
        >
        <div className="max-w-6xl mx-auto bg-white shadow rounded p-6">
            <h2 className="text-xl font-bold text-center">All Results</h2>

            {/* 🔍 Filter Form */}
            <form onSubmit={handleSearch} className="flex flex-wrap gap-2 mb-4">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by ID / Name / Roll"
                    className="border rounded px-3 py-2 w-64"
                />

                {/* ✅ Exam Dropdown */}
                <select
                    value={examId}
                    onChange={(e) => setExamId(e.target.value)}
                    className="border rounded px-3 py-2"
                >
                    <option value="">-- Select Exam --</option>
                    {exams.map((exam) => (
                        <option key={exam.id} value={exam.id}>
                            {exam.exam_name}
                        </option>
                    ))}
                </select>

                <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                    Search
                </button>

                <Link
                    href={route("student.results.create")}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 ml-auto"
                >
                    + Add Result
                </Link>
            </form>

            {/* 📊 Table */}
            {results.data.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300 text-sm">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border px-3 py-2">Student ID</th>
                                <th className="border px-3 py-2">Student Name</th>
                                <th className="border px-3 py-2">Roll No</th>
                                <th className="border px-3 py-2">Class</th>
                                <th className="border px-3 py-2">Exam</th>
                                <th className="border px-3 py-2">Subject</th>
                                <th className="border px-3 py-2">Marks</th>
                                <th className="border px-3 py-2">Grade</th>
                                <th className="border px-3 py-2">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.data.map((r, index) => (
                                <tr key={index}>
                                    <td className="border px-3 py-2">{r.student?.id}</td>
                                    <td className="border px-3 py-2">{r.student?.student_name}</td>
                                    <td className="border px-3 py-2">{r.student?.roll_number}</td>
                                    <td className="border px-3 py-2">{r.student?.school_class?.class_name}</td>
                                    <td className="border px-3 py-2">{r.exam?.exam_name}</td>
                                    <td className="border px-3 py-2">{r.subject?.subject_name}</td>
                                    <td className="border px-3 py-2">{r.marks_obtained}</td>
                                    <td className="border px-3 py-2">{r.grade}</td>
                                    <td className="border px-3 py-2 flex gap-1">
                                        <Link
                                            href={route('students.exam.marksheet', [r.student_id, r.exam_id])}
                                            className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                                        >
                                            Mark Sheet
                                        </Link>
                                        <Link
                                            href={route('results.edit', r.id)}
                                            className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => {
                                                if (confirm('Are you sure you want to delete this result?')) {
                                                    router.delete(route('results.destroy', r.id));
                                                }
                                            }}
                                            className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p>No results found.</p>
            )}

            {/* 🔽 Pagination + Per Page */}
            <div className="flex justify-between items-center mt-4">
                <div className="flex items-center gap-2">
                    <label htmlFor="perPage">Show per page:</label>
                    <select
                        id="perPage"
                        value={perPage}
                        onChange={handlePerPageChange}
                        className="border rounded px-6 py-1"
                    >
                        <option value="20">20</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                        <option value={results.total}>All</option>
                    </select>
                </div>

                <div className="flex space-x-2">
                    {results.links.map((link, index) => (
                        <Link
                            key={index}
                            href={link.url || "#"}
                            className={`px-3 py-1 rounded ${link.active
                                ? "bg-blue-600 text-white"
                                : "bg-gray-200 hover:bg-gray-300"
                                }`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            </div>
        </div>
            </AdminDashboardLayout>
    );
};

export default ViewResult;
