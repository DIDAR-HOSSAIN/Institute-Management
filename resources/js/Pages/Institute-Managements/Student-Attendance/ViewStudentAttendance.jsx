import React from "react";
import { useForm, Link } from "@inertiajs/react";

const ViewStudentAttendance = ({ attendances, classes, sections, schedules, filters, summary }) => {
    console.log("view attendances", attendances);

    const { data, setData, get } = useForm({
        school_class_id: filters?.school_class_id || "",
        section_id: filters?.section_id || "",
        schedule_id: filters?.schedule_id || "",
        start_date: filters?.start_date || "",
        end_date: filters?.end_date || ""
    });


    const submit = (e) => {
        e.preventDefault();
        get(route("attendance.index"), { preserveState: true, preserveScroll: true });
    };

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">📊 Attendance Report</h1>

            {/* Summary Cards */}
            <div className="grid grid-cols-4 gap-4 mb-4">
                {Object.entries(summary).map(([key, value]) => (
                    <div key={key} className="bg-gray-100 p-3 rounded shadow text-center">
                        <h2 className="font-bold">{key}</h2>
                        <p className="text-lg">{value}</p>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <form onSubmit={submit} className="flex flex-wrap gap-2 mb-4">
                <select
                    value={data.school_class_id}
                    onChange={e => setData("school_class_id", e.target.value)}
                    className="border px-2 py-1"
                >
                    <option value="">All Classes</option>
                    {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>

                <select
                    value={data.section_id}
                    onChange={e => setData("section_id", e.target.value)}
                    className="border px-2 py-1"
                >
                    <option value="">All Sections</option>
                    {sections.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>

                <select
                    value={data.schedule_id}
                    onChange={e => setData("schedule_id", e.target.value)}
                    className="border px-2 py-1"
                >
                    <option value="">All Schedules</option>
                    {schedules.map(sch => <option key={sch.id} value={sch.id}>{sch.name}</option>)}
                </select>

                <input
                    type="date"
                    value={data.start_date}
                    onChange={e => setData("start_date", e.target.value)}
                    className="border px-2 py-1"
                />
                <input
                    type="date"
                    value={data.end_date}
                    onChange={e => setData("end_date", e.target.value)}
                    className="border px-2 py-1"
                />

                <button type="submit" className="bg-blue-500 text-white px-4 py-1 rounded">
                    Filter
                </button>
            </form>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full border">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border px-2 py-1">Date</th>
                            <th className="border px-2 py-1">Roll</th>
                            <th className="border px-2 py-1">Name</th>
                            <th className="border px-2 py-1">Class</th>
                            <th className="border px-2 py-1">Section</th>
                            <th className="border px-2 py-1">Schedule</th>
                            <th className="border px-2 py-1">In</th>
                            <th className="border px-2 py-1">Out</th>
                            <th className="border px-2 py-1">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {attendances.data.map((row) => (
                            <tr key={row.id}>
                                <td className="border px-2 py-1">{row.date}</td>
                                <td className="border px-2 py-1">{row.student?.roll_number || "N/A"}</td>
                                <td className="border px-2 py-1">{row.student?.student_name || "N/A"}</td>
                                <td className="border px-2 py-1">{row.student?.school_class?.class_name || "N/A"}</td>
                                <td className="border px-2 py-1">{row.student?.section?.section_name || "N/A"}</td>
                                <td className="border px-2 py-1">{row.class_schedule?.schedule_name || "N/A"}</td>
                                <td className="border px-2 py-1">{row.in_time}</td>
                                <td className="border px-2 py-1">{row.out_time}</td>
                                <td className="border px-2 py-1">{row.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="mt-4 flex gap-2">
                {attendances.links.map((link, i) => (
                    <Link
                        key={i}
                        href={link.url || "#"}
                        className={`px-3 py-1 border ${link.active ? "bg-blue-500 text-white" : ""}`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ))}
            </div>
        </div>
    );
};

export default ViewStudentAttendance;
