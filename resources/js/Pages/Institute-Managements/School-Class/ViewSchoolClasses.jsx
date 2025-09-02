import React from "react";
import { useForm } from "@inertiajs/react";

const ViewSchoolClasses = ({ classes }) => {
    const classForm = useForm({ name: "" });
    const sectionForm = useForm({ school_class_id: "", name: "" });
    const scheduleForm = useForm({
        school_class_id: "",
        section_id: "",
        start_time: "",
        end_time: ""
    });

    return (
        <div className="p-6 space-y-6">
            {/* Add Class */}
            <div className="p-4 border rounded-lg">
                <h2 className="text-lg font-bold mb-2">Add Class</h2>
                <form onSubmit={e => { e.preventDefault(); classForm.post("/school-setup/class"); }}>
                    <input type="text" className="border p-2" placeholder="Class Name"
                        value={classForm.data.name}
                        onChange={e => classForm.setData("name", e.target.value)} />
                    <button className="ml-2 bg-blue-500 text-white px-3 py-1 rounded">Save</button>
                </form>
            </div>

            {/* Add Section */}
            <div className="p-4 border rounded-lg">
                <h2 className="text-lg font-bold mb-2">Add Section</h2>
                <form onSubmit={e => { e.preventDefault(); sectionForm.post("/school-setup/section"); }}>
                    <select className="border p-2"
                        value={sectionForm.data.school_class_id}
                        onChange={e => sectionForm.setData("school_class_id", e.target.value)}>
                        <option value="">Select Class</option>
                        {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <input type="text" className="border p-2 ml-2" placeholder="Section Name"
                        value={sectionForm.data.name}
                        onChange={e => sectionForm.setData("name", e.target.value)} />
                    <button className="ml-2 bg-green-500 text-white px-3 py-1 rounded">Save</button>
                </form>
            </div>

            {/* Add Schedule */}
            <div className="p-4 border rounded-lg">
                <h2 className="text-lg font-bold mb-2">Add Schedule</h2>
                <form onSubmit={e => { e.preventDefault(); scheduleForm.post("/school-setup/schedule"); }}>
                    <select className="border p-2"
                        value={scheduleForm.data.school_class_id}
                        onChange={e => scheduleForm.setData("school_class_id", e.target.value)}>
                        <option value="">Select Class</option>
                        {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <select className="border p-2 ml-2"
                        value={scheduleForm.data.section_id}
                        onChange={e => scheduleForm.setData("section_id", e.target.value)}>
                        <option value="">Select Section</option>
                        {classes.flatMap(c => c.sections).map(s => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                    </select>
                    <input type="time" className="border p-2 ml-2"
                        value={scheduleForm.data.start_time}
                        onChange={e => scheduleForm.setData("start_time", e.target.value)} />
                    <input type="time" className="border p-2 ml-2"
                        value={scheduleForm.data.end_time}
                        onChange={e => scheduleForm.setData("end_time", e.target.value)} />
                    <button className="ml-2 bg-purple-500 text-white px-3 py-1 rounded">Save</button>
                </form>
            </div>

            {/* Display Classes, Sections, Schedules */}
            <div className="p-4 border rounded-lg">
                <h2 className="text-lg font-bold mb-2">All Classes</h2>
                {classes.map(c => (
                    <div key={c.id} className="mb-4">
                        <h3 className="font-bold">{c.name}</h3>
                        <p>Sections: {c.sections.map(s => s.name).join(", ")}</p>
                        <ul className="list-disc ml-6">
                            {c.schedules.map(sc => (
                                <li key={sc.id}>
                                    {sc.start_time} - {sc.end_time}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ViewSchoolClasses;
