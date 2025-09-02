import React from 'react';
import { Link, usePage } from '@inertiajs/react';

const ViewStudents = () => {
    const { students, flash } = usePage().props;
    console.log('STUDENTS', students);

    return (
        <div className="max-w-5xl mx-auto p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-semibold">Students</h1>
                <Link href={route('students.create')} className="bg-green-600 text-white px-4 py-2 rounded">
                    Add Student
                </Link>
            </div>

            {flash?.success && (
                <div className="mb-4 p-2 bg-green-200 text-green-800 rounded">{flash.success}</div>
            )}

            <div className="bg-white shadow rounded overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-2 border">#</th>
                            <th className="p-2 border">Name</th>
                            <th className="p-2 border">Roll</th>
                            <th className="p-2 border">Class</th>
                            <th className="p-2 border">Section</th>
                            <th className="p-2 border">Academic Year</th>
                            <th className="p-2 border">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((stu, idx) => (
                            <tr key={stu.id} className="odd:bg-white even:bg-gray-50">
                                <td className="p-2 border">{idx + 1}</td>
                                <td className="p-2 border">{stu.student_name}</td>
                                <td className="p-2 border">{stu.roll_number}</td>
                                <td className="p-2 border">{stu.school_class?.class_name ?? '-'}</td>
                                <td className="p-2 border">{stu.section?.section_name ?? '-'}</td>
                                <td className="p-2 border">{stu.academic_year ?? '-'}</td>
                                <td className="p-2 border flex gap-2">
                                    <Link href={route('students.edit', stu.id)} className="bg-yellow-400 px-2 py-1 rounded text-sm">Edit</Link>

                                    <form method="post" action={route('students.destroy', stu.id)} onSubmit={(e) => {
                                        if (!confirm('Are you sure to delete this student?')) e.preventDefault();
                                    }}>
                                        <input type="hidden" name="_method" value="delete" />
                                        <input type="hidden" name="_token" value={document.querySelector('meta[name="csrf-token"]').content} />
                                        <button type="submit" className="bg-red-500 text-white px-2 py-1 rounded text-sm">Delete</button>
                                    </form>
                                </td>
                            </tr>
                        ))}
                        {students.length === 0 && (
                            <tr>
                                <td colSpan="7" className="p-4 text-center text-sm text-gray-500">No students found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ViewStudents;