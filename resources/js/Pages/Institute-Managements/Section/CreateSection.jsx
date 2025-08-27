import React, { useState } from 'react';
import { useForm, Link, usePage } from '@inertiajs/react';

const CreateSection = () => {
    const { classes } = usePage().props;
    const { data, setData, post, processing, errors } = useForm({
        section_name: '',
        school_class_id: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('sections.store'));
    };

    return (
        <div className="p-6">
            <h1 className="text-xl font-bold mb-4">Add Section</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-1">Section Name</label>
                    <input
                        type="text"
                        value={data.section_name}
                        onChange={(e) => setData('section_name', e.target.value)}
                        className="border p-2 w-full"
                    />
                    {errors.section_name && <div className="text-red-500">{errors.section_name}</div>}
                </div>
                <div>
                    <label className="block mb-1">Select Class</label>
                    <select
                        value={data.school_class_id}
                        onChange={(e) => setData('school_class_id', e.target.value)}
                        className="border p-2 w-full"
                    >
                        <option value="">Select Class</option>
                        {classes.map(cls => (
                            <option key={cls.id} value={cls.id}>{cls.class_name}</option>
                        ))}
                    </select>
                    {errors.school_class_id && <div className="text-red-500">{errors.school_class_id}</div>}
                </div>
                <button type="submit" disabled={processing} className="bg-blue-500 text-white px-4 py-2 rounded">
                    Save
                </button>
                <Link href={route('sections.index')} className="ml-2 text-gray-500">Cancel</Link>
            </form>
        </div>
    );
};

export default CreateSection;
