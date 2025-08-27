import React from 'react';
import { Link, usePage } from '@inertiajs/react';

const ViewSchoolClasses = () => {
    const { classes } = usePage().props;
    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-semibold">School Classes</h1>
                <Link href={route('classes.create')} className="bg-green-600 text-white px-3 py-2 rounded">New Class</Link>
            </div>

            <div className="space-y-3">
                {classes.map(cls => (
                    <div key={cls.id} className="bg-white p-3 rounded shadow flex justify-between items-center">
                        <div>
                            <div className="font-medium">{cls.name}</div>
                            <div className="text-sm text-gray-600">{(cls.sections || []).length} sections</div>
                        </div>
                        <div className="flex gap-2">
                            <Link href={route('classes.edit', cls.id)} className="text-blue-600">Edit</Link>
                            <form method="post" action={route('classes.destroy', cls.id)}>
                                <input type="hidden" name="_method" value="delete" />
                                <input type="hidden" name="_token" value={document.querySelector('meta[name="csrf-token"]').getAttribute('content')} />
                                <button type="submit" className="text-red-600" onClick={(e) => { if (!confirm('Delete?')) e.preventDefault(); }}>Delete</button>
                            </form>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ViewSchoolClasses;
