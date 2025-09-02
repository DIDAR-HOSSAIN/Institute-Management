import React, { useState } from "react";
import { useForm, usePage, Link } from "@inertiajs/react";

export default function Create() {
    const { classes } = usePage().props;
    const { data, setData, post, processing, errors, reset } = useForm({
        student_name: '',
        roll_number: '',
        school_class_id: '',
        section_id: '',
        dob: '',
        academic_year: '',
        device_user_id: '',
        gender: '',
        contact_no: '',
        address: ''
    });

    const [sections, setSections] = useState([]);

    function onClassChange(e) {
        const id = e.target.value;
        setData('school_class_id', id);
        setData('section_id', '');
        const cls = classes.find(c => c.id == id);
        setSections(cls ? cls.sections : []);
    }

    function submit(e) {
        e.preventDefault();
        post(route('students.store'), { onSuccess: () => reset() });
    }

    return (
        <div className="max-w-3xl mx-auto p-4 bg-white rounded shadow">
            <h1 className="text-xl font-bold mb-4">Add Student</h1>
            <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                    <label className="block mb-1">Name</label>
                    <input value={data.student_name} onChange={e => setData('student_name', e.target.value)} className="w-full border p-2 rounded" />
                    {errors.student_name && <div className="text-red-600">{errors.student_name}</div>}
                </div>

                <div>
                    <label className="block mb-1">Roll Number</label>
                    <input type="number" value={data.roll_number} onChange={e => setData('roll_number', e.target.value)} className="w-full border p-2 rounded" />
                    {errors.roll_number && <div className="text-red-600">{errors.roll_number}</div>}
                </div>

                <div>
                    <label className="block mb-1">Class</label>
                    <select value={data.school_class_id} onChange={onClassChange} className="w-full border p-2 rounded">
                        <option value="">Select Class</option>
                        {classes.map(c => <option key={c.id} value={c.id}>{c.class_name}</option>)}
                    </select>
                    {errors.school_class_id && <div className="text-red-600">{errors.school_class_id}</div>}
                </div>

                <div>
                    <label className="block mb-1">Section</label>
                    <select value={data.section_id} onChange={e => setData('section_id', e.target.value)} className="w-full border p-2 rounded" disabled={!sections.length}>
                        <option value="">Select Section</option>
                        {sections.map(s => <option key={s.id} value={s.id}>{s.section_name}</option>)}
                    </select>
                    {errors.section_id && <div className="text-red-600">{errors.section_id}</div>}
                </div>

                <div>
                    <label className="block mb-1">DOB</label>
                    <input type="date" value={data.dob} onChange={e => setData('dob', e.target.value)} className="w-full border p-2 rounded" />
                </div>

                <div>
                    <label className="block mb-1">Academic Year</label>
                    <input value={data.academic_year} onChange={e => setData('academic_year', e.target.value)} className="w-full border p-2 rounded" placeholder="e.g. 2024-2025" />
                </div>
                <div>
                    <label className="block mb-1">Attendance ID</label>
                    <input value={data.device_user_id} onChange={e => setData('device_user_id', e.target.value)} className="w-full border p-2 rounded" placeholder="Attendance ID" />
                </div>

                <div>
                    <label className="block mb-1">Gender</label>
                    <select value={data.gender} onChange={e => setData('gender', e.target.value)} className="w-full border p-2 rounded">
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <div>
                    <label className="block mb-1">Contact No</label>
                    <input value={data.contact_no} onChange={e => setData('contact_no', e.target.value)} className="w-full border p-2 rounded" />
                </div>

                <div className="md:col-span-2">
                    <label className="block mb-1">Address</label>
                    <textarea value={data.address} onChange={e => setData('address', e.target.value)} className="w-full border p-2 rounded" />
                </div>

                <div className="md:col-span-2 flex justify-end">
                    <button disabled={processing} className="bg-indigo-600 text-white px-4 py-2 rounded">Save</button>
                </div>
            </form>
        </div>
    );
}
