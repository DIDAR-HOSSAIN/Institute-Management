import { useForm } from '@inertiajs/inertia-react';
import React from 'react';

const CreateHoliday = () => {
    const { data, setData, post, processing, errors } = useForm({
        date: "",
        title: "",
        description: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("holidays.store"));
    };

    return (
        <div className="max-w-lg mx-auto bg-white p-6 shadow rounded">
            <h2 className="text-xl font-bold mb-4">Add Holiday</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label>Date</label>
                    <input
                        type="date"
                        className="w-full border p-2"
                        value={data.date}
                        onChange={(e) => setData("date", e.target.value)}
                    />
                    {errors.date && <div className="text-red-500">{errors.date}</div>}
                </div>
                <div className="mb-3">
                    <label>Title</label>
                    <input
                        type="text"
                        className="w-full border p-2"
                        value={data.title}
                        onChange={(e) => setData("title", e.target.value)}
                    />
                    {errors.title && <div className="text-red-500">{errors.title}</div>}
                </div>
                <div className="mb-3">
                    <label>Description</label>
                    <textarea
                        className="w-full border p-2"
                        value={data.description}
                        onChange={(e) => setData("description", e.target.value)}
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    disabled={processing}
                >
                    Save
                </button>
            </form>
        </div>
    );
};

export default CreateHoliday;