import React from "react";
import { useForm, Link } from "@inertiajs/react";

const ViewStudentAttendance = ({ attendances, classes, sections, schedules, filters, summary }) => {
    const { data, setData, get } = useForm({
        school_class_id: filters?.school_class_id || "",
        section_id: filters?.section_id || "",
        schedule_id: filters?.schedule_id || "",
        start_date: filters?.start_date || "",
        end_date: filters?.end_date || ""
    });

    const submit = (e) => {
        e.preventDefault();
        get(route("attendance.index"), {
            preserveState: true,
            preserveScroll: true,
            data,
        });
    };

    const statusBadge = (status) => {
        switch (status) {
            case "Absent": return "bg-red-100 text-red-800";
            case "Late": return "bg-yellow-100 text-yellow-800";
            case "Leave": return "bg-blue-100 text-blue-800";
            case "Holiday": return "bg-green-100 text-green-800";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">📊 Attendance Report</h1>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-4">
                {Object.entries(summary).map(([key, value]) => (
                    <div key={key} className="bg-gray-100 p-3 rounded shadow text-center">
                        <h2 className="font-semibold">{key}</h2>
                        <p className="text-xl font-bold">{value}</p>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <form onSubmit={submit} className="flex flex-wrap gap-2 mb-4">
                {[{
                    label: "Class",
                    value: data.school_class_id,
                    onChange: e => setData("school_class_id", e.target.value),
                    options: classes.map(c => ({ value: c.id, label: c.class_name })),
                    placeholder: "All Classes"
                },{
                    label: "Section",
                    value: data.section_id,
                    onChange: e => setData("section_id", e.target.value),
                    options: sections.map(s => ({ value: s.id, label: s.section_name })),
                    placeholder: "All Sections"
                },{
                    label: "Schedule",
                    value: data.schedule_id,
                    onChange: e => setData("schedule_id", e.target.value),
                    options: schedules.map(sch => ({ value: sch.id, label: sch.schedule_name })),
                    placeholder: "All Schedules"
                }].map((filter, i) => (
                    <select
                        key={i}
                        value={filter.value}
                        onChange={filter.onChange}
                        className="border px-2 py-1 rounded"
                    >
                        <option value="">{filter.placeholder}</option>
                        {filter.options.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                ))}
                <input
                    type="date"
                    value={data.start_date}
                    onChange={(e) => setData("start_date", e.target.value)}
                    className="border px-2 py-1 rounded"
                />
                <input
                    type="date"
                    value={data.end_date}
                    onChange={(e) => setData("end_date", e.target.value)}
                    className="border px-2 py-1 rounded"
                />
                <button type="submit" className="bg-blue-500 text-white px-4 py-1 rounded">
                    Filter
                </button>
            </form>

            {/* Attendance Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full border rounded">
                    <thead>
                        <tr className="bg-gray-200 text-left">
                            {["Date", "Roll", "Name", "Class", "Section", "Schedule", "In", "Out", "Status"].map((th, i) => (
                                <th key={i} className="border px-2 py-1">{th}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {attendances.data.map((row) => {
                            let finalStatus = row.final_status || row.status;

                            return (
                                <tr key={row.id} className="hover:bg-gray-50">
                                    <td className="border px-2 py-1">{row.date}</td>
                                    <td className="border px-2 py-1">{row.student?.roll_number || "--"}</td>
                                    <td className="border px-2 py-1">{row.student?.student_name || "--"}</td>
                                    <td className="border px-2 py-1">{row.student?.school_class?.class_name || "--"}</td>
                                    <td className="border px-2 py-1">{row.student?.section?.section_name || "--"}</td>
                                    <td className="border px-2 py-1">{row.class_schedule?.schedule_name || "--"}</td>
                                    <td className="border px-2 py-1">{row.in_time || "--"}</td>
                                    <td className="border px-2 py-1">{row.out_time || "--"}</td>
                                    <td className={`border px-2 py-1 font-semibold rounded text-center ${statusBadge(finalStatus)}`}>
                                        {finalStatus}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="mt-4 flex flex-wrap gap-2">
                {attendances.links.map((link, i) => (
                    <Link
                        key={i}
                        href={link.url || "#"}
                        className={`px-3 py-1 border rounded ${link.active ? "bg-blue-500 text-white" : "bg-white text-gray-800"}`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ))}
            </div>
        </div>
    );
};

export default ViewStudentAttendance;
