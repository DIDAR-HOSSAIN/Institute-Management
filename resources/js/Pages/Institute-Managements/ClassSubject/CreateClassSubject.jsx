import React, { useState } from "react";
import { useForm, router } from "@inertiajs/react";

export default function ClassSubjectIndex({ classes, subjects }) {

    const [editSubject, setEditSubject] = useState(null);

    // Subject Form (Create / Edit)
    const { data: subjectData, setData: setSubjectData, post: postSubject, put, processing: subjectProcessing, reset } = useForm({
        type: "subject",
        subject_name: "",
        subject_code: "",
        full_mark: "",
        pass_mark: "",
    });

    // Class-Subject Assign Form
    const { data: assignData, setData: setAssignData, post: postAssign, processing: assignProcessing } = useForm({
        type: "class_subject",
        school_class_id: "",
        subject_ids: [],
    });

    const handleAssignCheckbox = (id) => {
        if (assignData.subject_ids.includes(id)) {
            setAssignData("subject_ids", assignData.subject_ids.filter((s) => s !== id));
        } else {
            setAssignData("subject_ids", [...assignData.subject_ids, id]);
        }
    };

    const handleEdit = (subject) => {
        setEditSubject(subject);
        setSubjectData({
            type: "subject",
            subject_name: subject.subject_name,
            subject_code: subject.subject_code,
            full_mark: subject.full_mark,
            pass_mark: subject.pass_mark,
        });
    };

    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this subject?")) {
            router.delete(route("class-subject.destroy", id));
        }
    };

    const handleSubjectSubmit = (e) => {
        e.preventDefault();
        if (editSubject) {
            put(route("class-subject.update", editSubject.id), {
                onSuccess: () => {
                    reset();
                    setEditSubject(null);
                },
            });
        } else {
            postSubject(route("class-subject.store"), {
                onSuccess: () => reset(),
            });
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-6 bg-white shadow rounded space-y-8">
            <h2 className="text-2xl font-bold mb-4">Subject & Class-Subject Management</h2>

            {/* -------- Subject Create / Edit -------- */}
            <div className="p-4 border rounded">
                <h3 className="text-lg font-semibold mb-3">{editSubject ? "Edit Subject" : "Create Subject"}</h3>
                <form onSubmit={handleSubjectSubmit} className="grid grid-cols-2 gap-4">
                    <input
                        type="text"
                        placeholder="Subject Name"
                        value={subjectData.subject_name}
                        onChange={(e) => setSubjectData("subject_name", e.target.value)}
                        className="border p-2 rounded"
                    />
                    <input
                        type="text"
                        placeholder="Subject Code"
                        value={subjectData.subject_code}
                        onChange={(e) => setSubjectData("subject_code", e.target.value)}
                        className="border p-2 rounded"
                    />
                    <input
                        type="number"
                        placeholder="Full Mark"
                        value={subjectData.full_mark}
                        onChange={(e) => setSubjectData("full_mark", e.target.value)}
                        className="border p-2 rounded"
                    />
                    <input
                        type="number"
                        placeholder="Pass Mark"
                        value={subjectData.pass_mark}
                        onChange={(e) => setSubjectData("pass_mark", e.target.value)}
                        className="border p-2 rounded"
                    />
                    <div className="col-span-2 flex gap-2">
                        <button
                            type="submit"
                            disabled={subjectProcessing}
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                            {editSubject ? "Update" : "Save"}
                        </button>
                        {editSubject && (
                            <button
                                type="button"
                                onClick={() => {
                                    reset();
                                    setEditSubject(null);
                                }}
                                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* -------- Subject List with Edit/Delete -------- */}
            <div className="p-4 border rounded">
                <h3 className="text-lg font-semibold mb-3">All Subjects</h3>
                <table className="w-full border">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-2 border">Name</th>
                            <th className="p-2 border">Code</th>
                            <th className="p-2 border">Full Mark</th>
                            <th className="p-2 border">Pass Mark</th>
                            <th className="p-2 border">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {subjects?.map((subject) => (
                            <tr key={subject.id}>
                                <td className="p-2 border">{subject.subject_name}</td>
                                <td className="p-2 border">{subject.subject_code}</td>
                                <td className="p-2 border">{subject.full_mark}</td>
                                <td className="p-2 border">{subject.pass_mark}</td>
                                <td className="p-2 border space-x-2">
                                    <button
                                        onClick={() => handleEdit(subject)}
                                        className="px-2 py-1 bg-blue-600 text-white rounded"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(subject.id)}
                                        className="px-2 py-1 bg-red-600 text-white rounded"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* -------- Class-Subject Assign -------- */}
            <div className="p-4 border rounded">
                <h3 className="text-lg font-semibold mb-3">Assign Subjects to Class</h3>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        postAssign(route("class-subject.store"));
                    }}
                    className="space-y-4"
                >
                    <select
                        value={assignData.school_class_id}
                        onChange={(e) => setAssignData("school_class_id", e.target.value)}
                        className="w-full border p-2 rounded"
                    >
                        <option value="">-- Select Class --</option>
                        {classes?.map((cls) => (
                            <option key={cls.id} value={cls.id}>
                                {cls.class_name}
                            </option>
                        ))}
                    </select>

                    <div className="grid grid-cols-2 gap-2">
                        {subjects?.map((subject) => (
                            <label key={subject.id} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={assignData.subject_ids.includes(subject.id)}
                                    onChange={() => handleAssignCheckbox(subject.id)}
                                />
                                <span>{subject.subject_name}</span>
                            </label>
                        ))}
                    </div>

                    <button
                        type="submit"
                        disabled={assignProcessing}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Assign Subjects
                    </button>
                </form>
            </div>

            {/* -------- Class-wise Subject View -------- */}
            <div className="p-4 border rounded">
                <h3 className="text-lg font-semibold mb-3">Class-wise Subjects</h3>
                {classes?.map((cls) => (
                    <div key={cls.id} className="mb-4 border-b pb-2">
                        <h4 className="font-bold">{cls.class_name}</h4>
                        <ul className="list-disc pl-5">
                            {cls.subjects?.length > 0 ? (
                                cls.subjects.map((sub) => <li key={sub.id}>{sub.subject_name}</li>)
                            ) : (
                                <li className="text-gray-500">No subjects assigned</li>
                            )}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
}
