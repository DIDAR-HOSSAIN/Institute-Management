import React, { useState } from "react";
import { useForm } from "@inertiajs/react";

const CreatePayroll = () => {
    const { post, setData, data, processing, errors } = useForm({
        attendance_file: null,
    });
    console.log('create attendance data', data)

    const handleFileChange = (e) => {
        setData("attendance_file", e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("payroll.store"), {
            preserveScroll: true,
        });
    };

    return (
        <div className="p-4">
            <h1 className="text-xl font-semibold mb-4">Upload Attendance</h1>
            {errors.attendance_file && (
                <div className="text-red-500 mb-2">{errors.attendance_file}</div>
            )}
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <input
                        type="file"
                        accept=".csv, .txt"
                        onChange={handleFileChange}
                        className="border border-gray-300 rounded p-2"
                    />
                </div>
                <button
                    type="submit"
                    disabled={processing}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    {processing ? "Uploading..." : "Upload"}
                </button>
            </form>
        </div>
    );
};

export default CreatePayroll;
