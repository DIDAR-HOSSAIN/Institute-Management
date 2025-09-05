import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';

const CreateClassSchedule = ({ classes, scheduleData = null }) => {
    const { data, setData, post, put, processing, errors } = useForm({
        school_class_id: scheduleData?.school_class_id || '',
        section_id: scheduleData?.section_id || '',
        schedule_name: scheduleData?.schedule_name || '',
        start_time: scheduleData?.start_time || '',
        end_time: scheduleData?.end_time || ''
    });

    const [sections, setSections] = useState([]);

    useEffect(() => {
        if (data.school_class_id) {
            const selected = classes.find(c => c.id == data.school_class_id);
            setSections(selected ? selected.sections : []);
        }
    }, [data.school_class_id, classes]);

    const handleClassChange = (classId) => {
        setData('school_class_id', classId);
        const selected = classes.find(c => c.id == classId);
        setSections(selected ? selected.sections : []);
        setData('section_id', ''); // clear section when class changes
    };

    const submit = (e) => {
        e.preventDefault();
        if (scheduleData) {
            // Update
            put(route('class-schedule.update', scheduleData.id));
        } else {
            // Create
            post(route('class-schedule.store'));
        }
    };

    return (
        <div className="max-w-lg mx-auto bg-white p-6 rounded shadow-md">
            <h2 className="text-xl font-bold mb-4">
                {scheduleData ? 'Update Class Schedule' : 'Create Class Schedule'}
            </h2>
            <form onSubmit={submit} className="space-y-4">
                <div>
                    <label className="block mb-1 font-medium">Class</label>
                    <select
                        value={data.school_class_id}
                        onChange={(e) => handleClassChange(e.target.value)}
                        className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Select Class</option>
                        {classes.map(cls => (
                            <option key={cls.id} value={cls.id}>{cls.class_name}</option>
                        ))}
                    </select>
                    {errors.school_class_id && <div className="text-red-500 mt-1">{errors.school_class_id}</div>}
                </div>

                <div>
                    <label className="block mb-1 font-medium">Section</label>
                    <select
                        value={data.section_id}
                        onChange={(e) => setData('section_id', e.target.value)}
                        className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Select Section</option>
                        {sections.map(sec => (
                            <option key={sec.id} value={sec.id}>{sec.section_name}</option>
                        ))}
                    </select>
                    {errors.section_id && <div className="text-red-500 mt-1">{errors.section_id}</div>}
                </div>

                <div>
                    <label className="block mb-1 font-medium">Schedule Name</label>
                    <input
                        type="text"
                        value={data.schedule_name}
                        onChange={(e) => setData('schedule_name', e.target.value)}
                        className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.schedule_name && <div className="text-red-500 mt-1">{errors.schedule_name}</div>}
                </div>

                <div className="flex flex-col md:flex-row md:space-x-4">
                    <div className="flex-1">
                        <label className="block mb-1 font-medium">Start Time</label>
                        <input
                            type="time"
                            value={data.start_time}
                            onChange={(e) => setData('start_time', e.target.value)}
                            className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.start_time && <div className="text-red-500 mt-1">{errors.start_time}</div>}
                    </div>
                    <div className="flex-1 mt-4 md:mt-0">
                        <label className="block mb-1 font-medium">End Time</label>
                        <input
                            type="time"
                            value={data.end_time}
                            onChange={(e) => setData('end_time', e.target.value)}
                            className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.end_time && <div className="text-red-500 mt-1">{errors.end_time}</div>}
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                    {scheduleData ? 'Update' : 'Save'}
                </button>
            </form>
        </div>
    );
};

export default CreateClassSchedule;
