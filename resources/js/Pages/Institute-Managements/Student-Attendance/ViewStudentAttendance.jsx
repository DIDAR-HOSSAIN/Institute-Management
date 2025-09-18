import React from "react";
import { useForm, Link } from "@inertiajs/react";
import AdminDashboardLayout from "@/backend/Dashboard/AdminDashboardLayout";

const ViewStudentAttendance = ({ attendances, classes, sections, schedules, filters, summary, auth }) => {
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
            case "Early Leave": return "bg-orange-100 text-orange-800";
            default: return "bg-gray-100 text-gray-800";
        }
    };


    return (
        <AdminDashboardLayout
            user={auth.user}
            header={
                <h1 className="font-semibold text-xl text-gray-800 leading-tight">
                    Student Attendance Management
                </h1>
            }
        >
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">📊 Attendance Report</h1>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-6">
                {Object.entries(summary).map(([key, value]) => (
                    <div key={key} className="bg-white p-4 rounded-lg shadow text-center">
                        <h2 className="font-semibold text-gray-600">{key}</h2>
                        <p className="text-2xl font-bold text-gray-900">{value}</p>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <form onSubmit={submit} className="flex flex-wrap gap-3 mb-6">
                {[
                    {
                        value: data.school_class_id,
                        onChange: e => setData("school_class_id", e.target.value),
                        options: classes.map(c => ({ value: c.id, label: c.class_name })),
                        placeholder: "All Classes"
                    },
                    {
                        value: data.section_id,
                        onChange: e => setData("section_id", e.target.value),
                        options: sections.map(s => ({ value: s.id, label: s.section_name })),
                        placeholder: "All Sections"
                    },
                    {
                        value: data.schedule_id,
                        onChange: e => setData("schedule_id", e.target.value),
                        options: schedules.map(sch => ({ value: sch.id, label: sch.schedule_name })),
                        placeholder: "All Schedules"
                    }
                ].map((filter, i) => (
                    <select
                        key={i}
                        value={filter.value}
                        onChange={filter.onChange}
                        className="border rounded px-3 py-2 text-sm"
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
                    className="border rounded px-3 py-2 text-sm"
                />
                <input
                    type="date"
                    value={data.end_date}
                    onChange={(e) => setData("end_date", e.target.value)}
                    className="border rounded px-3 py-2 text-sm"
                />
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                    Filter
                </button>
            </form>

            {/* Attendance Table */}
            <div className="overflow-x-auto rounded-lg shadow">
                <table className="min-w-full border text-sm">
                    <thead>
                        <tr className="bg-gray-100">
                            {["Date", "Roll", "Name", "Class", "Section", "Schedule", "In", "Out", "Status"].map((th, i) => (
                                <th key={i} className="border px-3 py-2 text-left">{th}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {attendances.data.map((row) => {
                            let finalStatus = row.final_status || row.status;

                            return (
                                <tr key={row.id} className="hover:bg-gray-50">
                                    <td className="border px-3 py-2">{row.date}</td>
                                    <td className="border px-3 py-2">{row.student?.roll_number || "--"}</td>
                                    <td className="border px-3 py-2">{row.student?.student_name || "--"}</td>
                                    <td className="border px-3 py-2">{row.student?.school_class?.class_name || "--"}</td>
                                    <td className="border px-3 py-2">{row.student?.section?.section_name || "--"}</td>
                                    <td className="border px-3 py-2">{row.class_schedule?.schedule_name || "--"}</td>
                                    <td className="border px-3 py-2">{row.in_time || "--"}</td>
                                    <td className="border px-3 py-2">{row.out_time || "--"}</td>
                                    <td className={`border px-3 py-2 font-medium text-center rounded-full ${statusBadge(finalStatus)}`}>
                                        {finalStatus}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="mt-6 flex flex-wrap gap-2">
                {attendances.links.map((link, i) => (
                    <Link
                        key={i}
                        href={link.url || "#"}
                        className={`px-3 py-1 border rounded text-sm ${link.active ? "bg-blue-600 text-white" : "bg-white text-gray-800 hover:bg-gray-100"}`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ))}
            </div>
        </div>
        </AdminDashboardLayout >
    );
};

export default ViewStudentAttendance;
