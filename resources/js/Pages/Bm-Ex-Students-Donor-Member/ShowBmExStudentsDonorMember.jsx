import AdminDashboardLayout from "@/backend/Dashboard/AdminDashboardLayout";
import { Head } from "@inertiajs/react";
import React from "react";

const ShowBmExStudents = ({ auth, member }) => {

    const formatDate = (date) => {
        if (!date) return '-';
        const parsedDate = new Date(date);
        return isNaN(parsedDate) ? '-' : parsedDate.toLocaleDateString("en-GB");
    };
    

    return (
        <AdminDashboardLayout
            user={auth.user}
            header={
                <h2 className="text-2xl font-semibold text-center md:text-left">
                    BM Ex-Students Donor Details
                </h2>
            }
        >
            <Head title="BM Ex-Students Donor Details" />
            <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-lg">
                {/* Member Image */}
                <div className="flex justify-center mb-6">
                    <img
                        src={`/public/images/donors/${member.image}`}
                        // src={`/images/donors/${member.image}`}   
                        alt="Member Image"
                        className="w-32 h-32 object-cover rounded-full border-4 border-blue-500"
                    />
                </div>

                {/* Member Name */}
                <h1 className="text-3xl font-bold text-center mb-6">
                    {member.name}
                </h1>

                {/* Member Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="flex flex-col">
                        <label className="font-medium text-sm text-gray-600">
                            Donor ID
                        </label>
                        <span className="text-lg">{member.donor_id}</span>
                    </div>
                    <div className="flex flex-col">
                        <label className="font-medium text-sm text-gray-600">
                            Father's Name
                        </label>
                        <span className="text-lg">{member.father_name}</span>
                    </div>
                    <div className="flex flex-col">
                        <label className="font-medium text-sm text-gray-600">
                            Mother's Name
                        </label>
                        <span className="text-lg">{member.mother_name}</span>
                    </div>
                    <div className="flex flex-col">
                        <label className="font-medium text-sm text-gray-600">
                            Date of Birth
                        </label>
                        <span className="text-lg">
                            {formatDate(member.date_of_birth)}
                        </span>
                    </div>
                    <div className="flex flex-col">
                        <label className="font-medium text-sm text-gray-600">
                            Gender
                        </label>
                        <span className="text-lg">{member.gender}</span>
                    </div>
                    <div className="flex flex-col">
                        <label className="font-medium text-sm text-gray-600">
                            Mobile No
                        </label>
                        <span className="text-lg">{member.mobile_no}</span>
                    </div>
                    <div className="flex flex-col">
                        <label className="font-medium text-sm text-gray-600">
                            NID No
                        </label>
                        <span className="text-lg">{member.nid_no}</span>
                    </div>
                    <div className="flex flex-col">
                        <label className="font-medium text-sm text-gray-600">
                            Email
                        </label>
                        <span className="text-lg">{member.email}</span>
                    </div>
                    <div className="flex flex-col">
                        <label className="font-medium text-sm text-gray-600">
                            Blood Group
                        </label>
                        <span className="text-lg">{member.blood_group}</span>
                    </div>
                    <div className="flex flex-col">
                        <label className="font-medium text-sm text-gray-600">
                            Occupation
                        </label>
                        <span className="text-lg">{member.occupation}</span>
                    </div>
                    <div className="flex flex-col">
                        <label className="font-medium text-sm text-gray-600">
                            Registration Date
                        </label>
                        <span className="text-lg">
                            {formatDate(member.reg_date)}
                        </span>
                    </div>
                    <div className="flex flex-col">
                        <label className="font-medium text-sm text-gray-600">
                            Approval Date
                        </label>
                        <span className="text-lg">
                            {formatDate(member.approval_date)}
                        </span>
                    </div>
                    <div className="flex flex-col">
                        <label className="font-medium text-sm text-gray-600">
                            Dakhil Year
                        </label>
                        <span className="text-lg">{member.dakhil_year}</span>
                    </div>
                    <div className="flex flex-col">
                        <label className="font-medium text-sm text-gray-600">
                            Alim Year
                        </label>
                        <span className="text-lg">{member.alim_year}</span>
                    </div>
                    <div className="flex flex-col">
                        <label className="font-medium text-sm text-gray-600">
                            Fazil Year
                        </label>
                        <span className="text-lg">{member.fazil_year}</span>
                    </div>
                    <div className="flex flex-col">
                        <label className="font-medium text-sm text-gray-600">
                            District
                        </label>
                        <span className="text-lg">{member.district}</span>
                    </div>
                    <div className="flex flex-col">
                        <label className="font-medium text-sm text-gray-600">
                            Upazila
                        </label>
                        <span className="text-lg">{member.upazila}</span>
                    </div>
                    <div className="flex flex-col">
                        <label className="font-medium text-sm text-gray-600">
                            Union or Pourshava
                        </label>
                        <span className="text-lg">
                            {member.union_or_pourshava}
                        </span>
                    </div>
                    <div className="flex flex-col">
                        <label className="font-medium text-sm text-gray-600">
                            Post Office
                        </label>
                        <span className="text-lg">{member.post_office}</span>
                    </div>
                    <div className="flex flex-col">
                        <label className="font-medium text-sm text-gray-600">
                            Ward No
                        </label>
                        <span className="text-lg">{member.ward_no}</span>
                    </div>
                    <div className="flex flex-col">
                        <label className="font-medium text-sm text-gray-600">
                            House No or Name
                        </label>
                        <span className="text-lg">
                            {member.house_no_or_name}
                        </span>
                    </div>
                    <div className="flex flex-col">
                        <label className="font-medium text-sm text-gray-600">
                            Present Address
                        </label>
                        <span className="text-lg">
                            {member.present_address}
                        </span>
                    </div>
                    <div className="flex flex-col">
                        <label className="font-medium text-sm text-gray-600">
                            Amount
                        </label>
                        <span className="text-lg">{member.amount}</span>
                    </div>
                    <div className="flex flex-col">
                        <label className="font-medium text-sm text-gray-600">
                            Transaction No
                        </label>
                        <span className="text-lg">{member.transaction_no}</span>
                    </div>
                    <div className="flex flex-col">
                        <label className="font-medium text-sm text-gray-600">
                            Status
                        </label>
                        <span className="text-lg">{member.status}</span>
                    </div>
                </div>
            </div>
        </AdminDashboardLayout>
    );
};

export default ShowBmExStudents;
