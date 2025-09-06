import { useForm } from "@inertiajs/react";
import React from "react";

const CreateLeave = ({ students }) => {
    const { data, setData, post, processing, errors } = useForm({
        student_id: "",
        start_date: "",
        end_date: "",
        reason: "",
        status: "Pending",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("leaves.store"));
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
                Create Leave
            </h2>

            <form onSubmit={submit} className="space-y-4">
                {/* Student Select */}
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                        Student
                    </label>
                    <select
                        value={data.student_id}
                        onChange={(e) => setData("student_id", e.target.value)}
                        className="border rounded-lg w-full p-2 focus:ring focus:ring-blue-300"
                    >
                        <option value="">Select Student</option>
                        {students.map((student) => (
                            <option key={student.id} value={student.id}>
                                {student.student_name} (Roll: {student.roll_number})
                            </option>
                        ))}
                    </select>
                    {errors.student_id && (
                        <p className="text-red-500 text-sm">{errors.student_id}</p>
                    )}
                </div>

                {/* Dates in Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Start Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Start Date
                        </label>
                        <input
                            type="date"
                            value={data.start_date}
                            onChange={(e) => setData("start_date", e.target.value)}
                            className="border rounded-lg w-full p-2 focus:ring focus:ring-blue-300"
                        />
                        {errors.start_date && (
                            <p className="text-red-500 text-sm">{errors.start_date}</p>
                        )}
                    </div>

                    {/* End Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            End Date
                        </label>
                        <input
                            type="date"
                            value={data.end_date}
                            onChange={(e) => setData("end_date", e.target.value)}
                            className="border rounded-lg w-full p-2 focus:ring focus:ring-blue-300"
                        />
                        {errors.end_date && (
                            <p className="text-red-500 text-sm">{errors.end_date}</p>
                        )}
                    </div>
                </div>

                {/* Reason */}
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                        Reason
                    </label>
                    <textarea
                        rows="3"
                        value={data.reason}
                        onChange={(e) => setData("reason", e.target.value)}
                        className="border rounded-lg w-full p-2 focus:ring focus:ring-blue-300"
                    />
                    {errors.reason && (
                        <p className="text-red-500 text-sm">{errors.reason}</p>
                    )}
                </div>

                {/* Status */}
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                        Status
                    </label>
                    <select
                        value={data.status}
                        onChange={(e) => setData("status", e.target.value)}
                        className="border rounded-lg w-full p-2 focus:ring focus:ring-blue-300"
                    >
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                    {errors.status && (
                        <p className="text-red-500 text-sm">{errors.status}</p>
                    )}
                </div>

                {/* Submit */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={processing}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition disabled:opacity-50"
                    >
                        {processing ? "Submitting..." : "Submit"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateLeave;
