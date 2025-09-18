import React from "react";
import { useForm, usePage, Link } from "@inertiajs/react";
import AdminDashboardLayout from "@/backend/Dashboard/AdminDashboardLayout";

export default function ClassFeeManager({ classes, fees, classFees, auth }) {
    const { flash } = usePage().props;

    // --------- Form States ---------
    const classForm = useForm({ class_name: "", action_type: "class" });
    const feeForm = useForm({ name: "", type: "one_time", action_type: "fee" });
    const classFeeForm = useForm({ school_class_id: "", fee_id: "", amount: "", action_type: "class_fee" });

    // --------- Handlers ---------
    const handleClassSubmit = (e) => {
        e.preventDefault();
        classForm.post(route("class-fees.store"), { preserveScroll: true });
    };

    const handleFeeSubmit = (e) => {
        e.preventDefault();
        feeForm.post(route("class-fees.store"), { preserveScroll: true });
    };

    const handleClassFeeSubmit = (e) => {
        e.preventDefault();
        classFeeForm.post(route("class-fees.store"), { preserveScroll: true });
    };

    return (
        <AdminDashboardLayout
            user={auth.user}
            header={
                <h1 className="font-semibold text-xl text-gray-800 leading-tight">
                    Fee Assign
                </h1>
            }
        >
        <div className="p-6 space-y-6">
            <h2 className="text-2xl font-bold text-center mb-6">🎓 Class Fee Management</h2>

            {/* -------- Add Class & Fee -------- */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Add Class */}
                <div className="bg-white shadow rounded-xl p-4">
                    <h3 className="font-semibold text-lg mb-3">Add Class</h3>
                    <form onSubmit={handleClassSubmit} className="space-y-3">
                        <input
                            type="text"
                            placeholder="Enter Class Name"
                            value={classForm.data.class_name}
                            onChange={e => classForm.setData("class_name", e.target.value)}
                            className="w-full border p-2 rounded"
                        />
                        <input type="hidden" name="action_type" value="class" />
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                        >
                            Save Class
                        </button>
                    </form>
                </div>

                {/* Add Fee */}
                <div className="bg-white shadow rounded-xl p-4">
                    <h3 className="font-semibold text-lg mb-3">Add Fee</h3>
                    <form onSubmit={handleFeeSubmit} className="space-y-3">
                        <input
                            type="text"
                            placeholder="Enter Fee Name"
                            value={feeForm.data.name}
                            onChange={e => feeForm.setData("name", e.target.value)}
                            className="w-full border p-2 rounded"
                        />
                        <select
                            value={feeForm.data.type}
                            onChange={e => feeForm.setData("type", e.target.value)}
                            className="w-full border p-2 rounded"
                        >
                            <option value="one_time">One Time</option>
                            <option value="recurring">Recurring</option>
                            <option value="exam">Exam</option>
                        </select>
                        <input type="hidden" name="action_type" value="fee" />
                        <button
                            type="submit"
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                        >
                            Save Fee
                        </button>
                    </form>
                </div>
            </div>

            {/* -------- Assign Fee to Class -------- */}
            <div className="bg-white shadow rounded-xl p-4">
                <h3 className="font-semibold text-lg mb-3">Assign Fee to Class</h3>
                <form onSubmit={handleClassFeeSubmit} className="grid md:grid-cols-3 gap-4">
                    <select
                        value={classFeeForm.data.school_class_id}
                        onChange={e => classFeeForm.setData("school_class_id", e.target.value)}
                        className="border p-2 rounded"
                    >
                        <option value="">Select Class</option>
                        {classes.map(cls => (
                            <option key={cls.id} value={cls.id}>
                                {cls.class_name}
                            </option>
                        ))}
                    </select>

                    <select
                        value={classFeeForm.data.fee_id}
                        onChange={e => classFeeForm.setData("fee_id", e.target.value)}
                        className="border p-2 rounded"
                    >
                        <option value="">Select Fee</option>
                        {fees.map(fee => (
                            <option key={fee.id} value={fee.id}>
                                {fee.name} ({fee.type})
                            </option>
                        ))}
                    </select>

                    <input
                        type="number"
                        placeholder="Amount"
                        value={classFeeForm.data.amount}
                        onChange={e => classFeeForm.setData("amount", e.target.value)}
                        className="border p-2 rounded"
                    />
                    <input type="hidden" name="action_type" value="class_fee" />

                    <button
                        type="submit"
                        className="col-span-3 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
                    >
                        Assign Fee
                    </button>
                </form>
            </div>

            {/* -------- View Section -------- */}
            <div className="bg-white shadow rounded-xl p-4">
                <h3 className="font-semibold text-lg mb-4">Class Fee List</h3>
                <div className="overflow-x-auto">
                    <table className="w-full border text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border px-3 py-2">#</th>
                                <th className="border px-3 py-2">Class</th>
                                <th className="border px-3 py-2">Fee</th>
                                <th className="border px-3 py-2">Amount</th>
                                <th className="border px-3 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {classFees.length > 0 ? (
                                classFees.map((cf, index) => (
                                    <tr key={cf.id}>
                                        <td className="border px-3 py-2">{index + 1}</td>
                                        <td className="border px-3 py-2">{cf.school_class.class_name}</td>
                                        <td className="border px-3 py-2">{cf.fee.name} ({cf.fee.type})</td>
                                        <td className="border px-3 py-2">{cf.amount}</td>
                                        <td className="border px-3 py-2">
                                            <Link href={route("class-fees.edit", cf.id)} className="text-blue-600 mr-2">Edit</Link>
                                            <Link href={route("class-fees.destroy", cf.id)} method="delete" as="button" className="text-red-600">Delete</Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center text-gray-500 py-3">No Data Found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        </AdminDashboardLayout>
    );
}
