import AdminDashboardLayout from '@/backend/Dashboard/AdminDashboardLayout';
import { useForm, Link } from '@inertiajs/inertia-react';
import React from 'react';

const CreateClassAndSection = ({ classes, auth }) => {
    // ✅ Class Form
    const {
        data: classData,
        setData: setClassData,
        post: postClass,
        processing: classProcessing,
        errors: classErrors,
        reset: resetClass
    } = useForm({ class_name: '' });

    function submitClass(e) {
        e.preventDefault();
        postClass(route('classes.store'), {
            onSuccess: () => resetClass()
        });
    }

    // ✅ Section Form
    const {
        data: sectionData,
        setData: setSectionData,
        post: postSection,
        processing: sectionProcessing,
        errors: sectionErrors,
        reset: resetSection
    } = useForm({ school_class_id: '', section_name: '' });

    function submitSection(e) {
        e.preventDefault();
        postSection(route('sections.store'), {
            onSuccess: () => resetSection()
        });
    }

    return (
        <AdminDashboardLayout
            user={auth.user}
            header={
                <h1 className="font-semibold text-xl text-gray-800 leading-tight">
                    Add Class & Section
                </h1>
            }
        >
        <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow space-y-8">
            {/* Class Create */}
            <div>
                <h2 className="text-xl font-semibold mb-4">➕ Add Class</h2>
                <form onSubmit={submitClass} className="space-y-3">
                    <input
                        type="text"
                        value={classData.class_name}
                        onChange={e => setClassData('class_name', e.target.value)}
                        placeholder="Class name"
                        className="w-full border px-3 py-2 rounded"
                    />
                    {classErrors.class_name && (
                        <div className="text-red-500 text-sm">{classErrors.class_name}</div>
                    )}
                    <button
                        disabled={classProcessing}
                        className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        Save Class
                    </button>
                </form>
            </div>

            {/* Section Create */}
            <div>
                <h2 className="text-xl font-semibold mb-4">➕ Add Section</h2>
                <form onSubmit={submitSection} className="space-y-3">
                    <select
                        value={sectionData.school_class_id}
                        onChange={e => setSectionData('school_class_id', e.target.value)}
                        className="w-full border px-3 py-2 rounded"
                    >
                        <option value="">-- Select Class --</option>
                        {classes.map(cls => (
                            <option key={cls.id} value={cls.id}>
                                {cls.class_name}
                            </option>
                        ))}
                    </select>
                    {sectionErrors.school_class_id && (
                        <div className="text-red-500 text-sm">{sectionErrors.school_class_id}</div>
                    )}

                    <input
                        type="text"
                        value={sectionData.section_name}
                        onChange={e => setSectionData('section_name', e.target.value)}
                        placeholder="Section name"
                        className="w-full border px-3 py-2 rounded"
                    />
                    {sectionErrors.section_name && (
                        <div className="text-red-500 text-sm">{sectionErrors.section_name}</div>
                    )}

                    <button
                        disabled={sectionProcessing}
                        className="bg-green-600 text-white px-4 py-2 rounded"
                    >
                        Save Section
                    </button>
                </form>
            </div>

            {/* Class & Section List */}
            <div>
                <h2 className="text-xl font-semibold mb-4">📋 Class & Sections</h2>
                <div className="overflow-x-auto">
                    <table className="w-full border text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border px-3 py-2">#</th>
                                <th className="border px-3 py-2">Class</th>
                                <th className="border px-3 py-2">Sections</th>
                                <th className="border px-3 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {classes.length > 0 ? (
                                classes.map((cls, index) => (
                                    <tr key={cls.id}>
                                        <td className="border px-3 py-2">{index + 1}</td>
                                        <td className="border px-3 py-2">{cls.class_name}</td>
                                        <td className="border px-3 py-2">
                                            {cls.sections.length > 0 ? (
                                                cls.sections.map(sec => (
                                                    <span
                                                        key={sec.id}
                                                        className="inline-block bg-gray-200 px-2 py-1 rounded mr-1"
                                                    >
                                                        {sec.section_name}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-gray-400">No sections</span>
                                            )}
                                        </td>
                                        <td className="border px-3 py-2">
                                            <Link
                                                href={route('classes.edit', cls.id)}
                                                className="text-blue-600 mr-2"
                                            >
                                                Edit
                                            </Link>
                                            <Link
                                                href={route('classes.destroy', cls.id)}
                                                method="delete"
                                                as="button"
                                                className="text-red-600"
                                            >
                                                Delete
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="4"
                                        className="text-center text-gray-500 py-3"
                                    >
                                        No Classes Found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        </AdminDashboardLayout>
    );
};

export default CreateClassAndSection;