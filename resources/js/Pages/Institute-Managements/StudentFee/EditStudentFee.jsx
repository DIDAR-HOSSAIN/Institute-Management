import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';

const EditStudentFee = ({ student = {}, fees = [], studentFees = [] }) => {
    // Initialize local state for fees safely
    const [feeData, setFeeData] = useState(
        studentFees.map((sf) => ({
            id: sf.id,
            fee_id: sf.class_fee?.fee_id || null,
            paid_amount: sf.total_paid || 0,
            payment_method: sf.payment_method || 'Cash',
            months: sf.months || [],
        }))
    );

    const handleChange = (index, field, value) => {
        const updated = [...feeData];
        updated[index][field] = value;
        setFeeData(updated);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!student.id) return; // safety check

        Inertia.put(route('student-fees.updateAll', student.id), { fees: feeData });
    };

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">
                Edit Fees for {student.student_name || 'Unknown Student'}
            </h1>

            <form onSubmit={handleSubmit}>
                <table className="table-auto border-collapse border border-gray-300 w-full mb-4">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border px-2 py-1">Fee Type</th>
                            <th className="border px-2 py-1">Paid Amount</th>
                            <th className="border px-2 py-1">Payment Method</th>
                            <th className="border px-2 py-1">Months</th>
                        </tr>
                    </thead>
                    <tbody>
                        {feeData.map((f, index) => {
                            const feeName = fees?.find((fee) => fee.id === f.fee_id)?.name || '-';
                            return (
                                <tr key={f.id} className="hover:bg-gray-50">
                                    <td className="border px-2 py-1">{feeName}</td>
                                    <td className="border px-2 py-1">
                                        <input
                                            type="number"
                                            value={f.paid_amount}
                                            onChange={(e) =>
                                                handleChange(index, 'paid_amount', e.target.value)
                                            }
                                            className="border px-2 py-1 w-full"
                                        />
                                    </td>
                                    <td className="border px-2 py-1">
                                        <select
                                            value={f.payment_method}
                                            onChange={(e) =>
                                                handleChange(index, 'payment_method', e.target.value)
                                            }
                                            className="border px-2 py-1 w-full"
                                        >
                                            <option value="Cash">Cash</option>
                                            <option value="Bkash">Bkash</option>
                                            <option value="Bank">Bank</option>
                                        </select>
                                    </td>
                                    <td className="border px-2 py-1">
                                        <input
                                            type="text"
                                            value={f.months?.join(', ') || ''}
                                            onChange={(e) =>
                                                handleChange(
                                                    index,
                                                    'months',
                                                    e.target.value.split(',').map((m) => m.trim())
                                                )
                                            }
                                            className="border px-2 py-1 w-full"
                                            placeholder="e.g., January, February"
                                        />
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Update All Fees
                </button>
            </form>
        </div>
    );
};

export default EditStudentFee;
