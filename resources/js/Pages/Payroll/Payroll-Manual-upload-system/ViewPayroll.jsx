const ViewPayroll = ({ attendances }) => {
    console.log("view attendances", attendances);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-semibold mb-4">Attendance Records</h1>
            <div className="overflow-x-auto">
                <table className="table-auto w-full min-w-max text-sm">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="px-4 py-2 text-left">Employee ID</th>
                            <th className="px-4 py-2 text-left">
                                Attendance Date
                            </th>
                            <th className="px-4 py-2 text-left">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {attendances.map((attendance) => (
                            <tr key={attendance.id} className="border-t">
                                <td className="px-4 py-2">
                                    {attendance.employee_id}
                                </td>
                                <td className="px-4 py-2">
                                    {attendance.attendance_date}
                                </td>
                                <td className="px-4 py-2">
                                    {attendance.status}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ViewPayroll;
