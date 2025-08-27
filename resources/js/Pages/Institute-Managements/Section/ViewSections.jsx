import React from 'react';
import { Link, usePage } from '@inertiajs/react';

const ViewSections = () => {
    const { sections } = usePage().props;
    return (
        <div className="p-6">
            <h1 className="text-xl font-bold mb-4">Sections</h1>
            <Link href={route('sections.create')} className="bg-blue-500 text-white px-4 py-2 rounded">Add Section</Link>

            <table className="table-auto w-full mt-4 border">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="p-2 border">ID</th>
                        <th className="p-2 border">Section Name</th>
                        <th className="p-2 border">Class Name</th>
                        <th className="p-2 border">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {sections.map(section => (
                        <tr key={section.id}>
                            <td className="p-2 border">{section.id}</td>
                            <td className="p-2 border">{section.section_name}</td>
                            <td className="p-2 border">{section.school_class?.class_name}</td>
                            <td className="p-2 border flex gap-2">
                                <Link href={route('sections.edit', section.id)} className="bg-yellow-500 text-white px-2 py-1 rounded">Edit</Link>
                                <Link as="button" method="delete" href={route('sections.destroy', section.id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ViewSections;
