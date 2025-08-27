import React from "react";
import { useForm } from "@inertiajs/react";

const PayrollReport = ({ attendances, filters }) => {
    const { data, setData, get } = useForm({
        start_date: filters.start_date || "",
        end_date: filters.end_date || "",
        class_id: filters.class_id || "",
    });

    const submit = (e) => {
        e.preventDefault();
        get(route("attendance.report"), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <div className="p-4">
            <h1 className="text-lg font-bold mb-4">Attendance Report</h1>

            {/* Filters */}
            <form onSubmit={submit} className="flex gap-2 mb-4">
                <input
                    type="date"
                    value={data.start_date}
                    onChange={(e) => setData("start_date", e.target.value)}
                    className="border px-2 py-1"
                />
                <input
                    type="date"
                    value={data.end_date}
                    onChange={(e) => setData("end_date", e.target.value)}
                    className="border px-2 py-1"
                />
                <select
                    value={data.class_id}
                    onChange={(e) => setData("class_id", e.target.value)}
                    className="border px-2 py-1"
                >
                    <option value="">All Classes</option>
                    {/* Map your classes here if passed as props */}
                </select>
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                    Filter
                </button>
            </form>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full border">
                    <thead>
                        <tr>
                            <th className="border px-2 py-1">Date</th>
                            <th className="border px-2 py-1">Roll</th>
                            <th className="border px-2 py-1">Name</th>
                            <th className="border px-2 py-1">Class</th>
                            <th className="border px-2 py-1">Section</th>
                            <th className="border px-2 py-1">In Time</th>
                            <th className="border px-2 py-1">Out Time</th>
                            <th className="border px-2 py-1">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {attendances.map((row, i) => (
                            <tr key={i}>
                                <td className="border px-2 py-1">{row.date}</td>
                                <td className="border px-2 py-1">
                                    {row.student?.roll_number || row.user_id}
                                </td>
                                <td className="border px-2 py-1">
                                    {row.student?.student_name || "N/A"}
                                </td>
                                <td className="border px-2 py-1">
                                    {row.student?.school_class?.name || "N/A"}
                                </td>
                                <td className="border px-2 py-1">
                                    {row.student?.section?.name || "N/A"}
                                </td>
                                <td className="border px-2 py-1">{row.in_time}</td>
                                <td className="border px-2 py-1">{row.out_time}</td>
                                <td className="border px-2 py-1">{row.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PayrollReport;
