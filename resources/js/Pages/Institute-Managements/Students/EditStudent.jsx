import React, { useState, useEffect } from 'react';
import { useForm, usePage, Link } from '@inertiajs/react';

const EditStudent = () => {
    const { student, classes, flash } = usePage().props;

    const { data, setData, put, processing, errors } = useForm({
        student_name: student.student_name || '',
        roll_number: student.roll_number || '',
        school_class_id: student.school_class_id || '',
        section_id: student.section_id || '',
        dob: student.dob || '',
        academic_year: student.academic_year || '',
        gender: student.gender || '',
        contact_no: student.contact_no || '',
        address: student.address || ''
    });

    const [sections, setSections] = useState([]);

    useEffect(() => {
        // populate sections based on initial class
        const cls = classes.find(c => c.id === data.school_class_id);
        setSections(cls ? cls.sections : []);
    }, []);

    function onClassChange(e) {
        const classId = e.target.value;
        setData('school_class_id', classId);
        setData('section_id', '');
        const cls = classes.find(c => c.id == classId);
        setSections(cls ? cls.sections : []);
    }

    function submit(e) {
        e.preventDefault();
        put(route('students.update', student.id));
    }

    return (
        <div className="max-w-3xl mx-auto p-4 bg-white rounded shadow">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-semibold">Edit Student</h1>
                <Link href={route('students.index')} className="text-sm text-gray-600">← Back</Link>
            </div>

            {flash?.success && <div className="mb-3 p-2 bg-green-200 text-green-800 rounded">{flash.success}</div>}

            <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                    <label className="block mb-1">Name</label>
                    <input value={data.student_name} onChange={e => setData('student_name', e.target.value)} className="w-full border p-2 rounded" />
                    {errors.student_name && <div className="text-red-600 text-sm">{errors.student_name}</div>}
                </div>

                <div>
                    <label className="block mb-1">Roll Number</label>
                    <input value={data.roll_number} onChange={e => setData('roll_number', e.target.value)} className="w-full border p-2 rounded" />
                    {errors.roll_number && <div className="text-red-600 text-sm">{errors.roll_number}</div>}
                </div>

                <div>
                    <label className="block mb-1">Class</label>
                    <select value={data.school_class_id} onChange={onClassChange} className="w-full border p-2 rounded">
                        <option value="">Select Class</option>
                        {classes.map(c => <option key={c.id} value={c.id}>{c.class_name}</option>)}
                    </select>
                    {errors.school_class_id && <div className="text-red-600 text-sm">{errors.school_class_id}</div>}
                </div>

                <div>
                    <label className="block mb-1">Section</label>
                    <select value={data.section_id} onChange={e => setData('section_id', e.target.value)} className="w-full border p-2 rounded" disabled={!sections.length}>
                        <option value="">Select Section</option>
                        {sections.map(s => <option key={s.id} value={s.id}>{s.section_name}</option>)}
                    </select>
                    {errors.section_id && <div className="text-red-600 text-sm">{errors.section_id}</div>}
                </div>

                <div>
                    <label className="block mb-1">DOB</label>
                    <input type="date" value={data.dob} onChange={e => setData('dob', e.target.value)} className="w-full border p-2 rounded" />
                    {errors.dob && <div className="text-red-600 text-sm">{errors.dob}</div>}
                </div>

                <div>
                    <label className="block mb-1">Academic Year</label>
                    <input value={data.academic_year} onChange={e => setData('academic_year', e.target.value)} placeholder="e.g. 2025-2026" className="w-full border p-2 rounded" />
                    {errors.academic_year && <div className="text-red-600 text-sm">{errors.academic_year}</div>}
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

                <div className="md:col-span-2 flex justify-end gap-2">
                    <Link href={route('students.index')} className="px-4 py-2 border rounded">Cancel</Link>
                    <button disabled={processing} className="bg-indigo-600 text-white px-4 py-2 rounded">Update</button>
                </div>
            </form>
        </div>
    );
};

export default EditStudent;