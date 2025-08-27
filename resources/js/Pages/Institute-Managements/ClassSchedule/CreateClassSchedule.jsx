import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';

const CreateClassSchedule = ({ classes }) => {
    const { data, setData, post, processing, errors } = useForm({
        school_class_id: '',
        section_id: '',
        schedule_name: '',
        start_time: '',
        end_time: ''
    });

    const [sections, setSections] = useState([]);

    const handleClassChange = (classId) => {
        setData('school_class_id', classId);
        const selected = classes.find(c => c.id == classId);
        setSections(selected ? selected.sections : []);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('class-schedule.store'));
    };

    return (
        <div className="max-w-lg mx-auto bg-white p-6 rounded shadow">
            <h2 className="text-xl font-bold mb-4">Create Class Schedule</h2>
            <form onSubmit={submit} className="space-y-4">
                <div>
                    <label className="block">Class</label>
                    <select
                        value={data.school_class_id}
                        onChange={(e) => handleClassChange(e.target.value)}
                        className="w-full border rounded p-2"
                    >
                        <option value="">Select Class</option>
                        {classes.map(cls => (
                            <option key={cls.id} value={cls.id}>{cls.class_name}</option>
                        ))}
                    </select>
                    {errors.school_class_id && <div className="text-red-500">{errors.school_class_id}</div>}
                </div>

                <div>
                    <label className="block">Section</label>
                    <select
                        value={data.section_id}
                        onChange={(e) => setData('section_id', e.target.value)}
                        className="w-full border rounded p-2"
                    >
                        <option value="">Select Section</option>
                        {sections.map(sec => (
                            <option key={sec.id} value={sec.id}>{sec.section_name}</option>
                        ))}
                    </select>
                    {errors.section_id && <div className="text-red-500">{errors.section_id}</div>}
                </div>

                <div>
                    <label className="block">Section Name</label>
                    <input
                        type="text"
                        value={data.schedule_name}
                        onChange={(e) => setData('schedule_name', e.target.value)}
                        className="border p-2 w-full"
                    />
                    {errors.schedule_name && <div className="text-red-500">{errors.schedule_name}</div>}
                </div>

                <div>
                    <label className="block">Start Time</label>
                    <input
                        type="time"
                        value={data.start_time}
                        onChange={(e) => setData('start_time', e.target.value)}
                        className="w-full border rounded p-2"
                    />
                    {errors.start_time && <div className="text-red-500">{errors.start_time}</div>}
                </div>

                <div>
                    <label className="block">End Time</label>
                    <input
                        type="time"
                        value={data.end_time}
                        onChange={(e) => setData('end_time', e.target.value)}
                        className="w-full border rounded p-2"
                    />
                    {errors.end_time && <div className="text-red-500">{errors.end_time}</div>}
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Save
                </button>
            </form>
        </div>
    );
};

export default CreateClassSchedule;
