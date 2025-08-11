import { useForm } from '@inertiajs/react';
import React from 'react';

const CreateStudent = () => {
    const { data, setData, post, processing, errors } = useForm({
        student_name: '',
        roll_number: '',
        class_id: '',
        section_id: '',
        dob: '',
        academic_year: '',
        gender: '',
        contact_no: '',
        address: ''
    });

    function submit(e) {
        e.preventDefault();
        post('/students');
    }
    return (
        <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
            <h1 className="text-xl font-bold mb-4">Add Student</h1>
            <form onSubmit={submit} className="space-y-4">
                <input type="text" placeholder="Student Name" value={data.student_name} onChange={e => setData('student_name', e.target.value)} className="w-full border p-2 rounded" />
                {errors.student_name && <div className="text-red-500">{errors.student_name}</div>}

                <input type="text" placeholder="Roll Number" value={data.roll_number} onChange={e => setData('roll_number', e.target.value)} className="w-full border p-2 rounded" />
                {errors.roll_number && <div className="text-red-500">{errors.roll_number}</div>}

                <input type="number" placeholder="Class ID" value={data.class_id} onChange={e => setData('class_id', e.target.value)} className="w-full border p-2 rounded" />

                <input type="number" placeholder="Section ID" value={data.section_id} onChange={e => setData('section_id', e.target.value)} className="w-full border p-2 rounded" />

                <input type="date" value={data.dob} onChange={e => setData('dob', e.target.value)} className="w-full border p-2 rounded" />

                <input type="text" placeholder="Academic Year" value={data.academic_year} onChange={e => setData('academic_year', e.target.value)} className="w-full border p-2 rounded" />

                <select value={data.gender} onChange={e => setData('gender', e.target.value)} className="w-full border p-2 rounded">
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </select>

                <input type="text" placeholder="Contact No" value={data.contact_no} onChange={e => setData('contact_no', e.target.value)} className="w-full border p-2 rounded" />

                <textarea placeholder="Address" value={data.address} onChange={e => setData('address', e.target.value)} className="w-full border p-2 rounded"></textarea>

                <button type="submit" disabled={processing} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Save
                </button>
            </form>
        </div>
    );
};

export default CreateStudent;
