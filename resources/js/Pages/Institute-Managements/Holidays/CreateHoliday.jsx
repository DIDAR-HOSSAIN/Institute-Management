import React, { useState } from "react";
import { useForm, usePage } from "@inertiajs/react";

const CreateClassSchedule = () => {
    const { classes } = usePage().props;
    const { data, setData, post, errors } = useForm({
        school_class_id: '',
        section_id: '',
        day_of_week: '',
        start_time: '',
        end_time: ''
    });

    const [sections, setSections] = useState([]);

    function onClassChange(e) {
        const id = e.target.value;
        setData('school_class_id', id);
        const cls = classes.find(c => c.id == id);
        setSections(cls ? cls.sections : []);
        setData('section_id', '');
    }

    function submit(e) {
        e.preventDefault();
        post(route('class-schedule.store'));
    }

    return (
        <form onSubmit={submit} className="space-y-4">
            <div>
                <label>Class</label>
                <select value={data.school_class_id} onChange={onClassChange}>
                    <option value="">Select Class</option>
                    {classes.map(c => <option key={c.id} value={c.id}>{c.class_name}</option>)}
                </select>
                {errors.school_class_id && <div>{errors.school_class_id}</div>}
            </div>

            <div>
                <label>Section</label>
                <select value={data.section_id} onChange={e => setData('section_id', e.target.value)}>
                    <option value="">Select Section</option>
                    {sections.map(s => <option key={s.id} value={s.id}>{s.section_name}</option>)}
                </select>
                {errors.section_id && <div>{errors.section_id}</div>}
            </div>

            <div>
                <label>Day</label>
                <select value={data.day_of_week} onChange={e => setData('day_of_week', e.target.value)}>
                    <option value="">Select Day</option>
                    {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
                        <option key={day} value={day}>{day}</option>
                    ))}
                </select>
                {errors.day_of_week && <div>{errors.day_of_week}</div>}
            </div>

            <div>
                <label>Start Time</label>
                <input type="time" value={data.start_time} onChange={e => setData('start_time', e.target.value)} />
                {errors.start_time && <div>{errors.start_time}</div>}
            </div>

            <div>
                <label>End Time</label>
                <input type="time" value={data.end_time} onChange={e => setData('end_time', e.target.value)} />
                {errors.end_time && <div>{errors.end_time}</div>}
            </div>

            <button type="submit">Save</button>
        </form>
    );
};

export default CreateClassSchedule;
