import { useForm } from '@inertiajs/inertia-react';
import React from 'react';

const CreateSchoolClass = () => {
    const { data, setData, post, processing, errors, reset } = useForm({ class_name: '' });

    function submit(e) {
        e.preventDefault();
        post(route('classes.store'), {
            onSuccess: () => reset()
        });
    }

    return (
        <div className="max-w-md mx-auto p-4 bg-white rounded shadow">
            <h2 className="text-xl font-semibold mb-4">Create Class</h2>
            <form onSubmit={submit} className="space-y-3">
                <input
                    type="text"
                    value={data.class_name}
                    onChange={e => setData('class_name', e.target.value)}
                    placeholder="Class name"
                    className="w-full border px-3 py-2 rounded"
                />
                {errors.class_name && <div className="text-red-500 text-sm">{errors.class_name}</div>}
                <button disabled={processing} className="bg-blue-600 text-white px-4 py-2 rounded">
                    Save
                </button>
            </form>
        </div>
    );
};

export default CreateSchoolClass;