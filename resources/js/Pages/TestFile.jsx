import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminDashboardLayout from "@/backend/Dashboard/AdminDashboardLayout";
import { Head } from "@inertiajs/react";
import Swal from "sweetalert2";

const EditBmExStudents = ({ auth, member, districts }) => {
    console.log("from edit member", member);
    const [data, setData] = useState({
        name: member.name || "",
        father_name: member.father_name || "",
        mother_name: member.mother_name || "",
        date_of_birth: member.date_of_birth || "",
        gender: member.gender || "",
        mobile_no: member.mobile_no || "",
        nid_no: member.nid_no || "",
        email: member.email || "",
        blood_group: member.blood_group || "",
        occupation: member.occupation || "",
        reg_date: member.reg_date || "",
        approval_date: member.approval_date || "",
        dakhil_year: member.dakhil_year || "",
        alim_year: member.alim_year || "",
        fazil_year: member.fazil_year || "",
        district: member.district || "",
        upazila: member.upazila || "",
        union_or_pourshava: member.union_or_pourshava || "",
        post_office: member.post_office || "",
        ward_no: member.ward_no || "",
        house_no_or_name: member.house_no_or_name || "",
        present_address: member.present_address || "",
        membership_fee: member.membership_fee || 300,
        transaction_no: member.transaction_no || "",
        status: member.status || "",
        image: null,
    });
    const [preview, setPreview] = useState(
        member.image ? `/images/students/${member.image}` : null
    );
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedDistrict, setSelectedDistrict] = useState(null);

    // Set the selected district when component mounts or member data changes
    useEffect(() => {
        const district = districts.find(
            (district) => district.name === member.district
        );
        setSelectedDistrict(district);
    }, [member.district, districts]);

    const handleDistrictChange = (e) => {
        const districtId = e.target.value;
        const district = districts.find(
            (district) => district.id === parseInt(districtId)
        );
        setSelectedDistrict(district);
        setData((prevData) => ({
            ...prevData,
            district: district ? district.name : "",
            upazila: "",
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData((prevData) => ({ ...prevData, image: file }));
            setPreview(URL.createObjectURL(file));
        }
    };

    const prepareFormData = () => {
        const formData = new FormData();
        formData.append("_method", "PUT");

        Object.keys(data).forEach((key) => {
            if (data[key] !== null && data[key] !== undefined) {
                formData.append(key, data[key]);
            }
        });

        return formData;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({}); // Clear previous errors

        try {
            const formData = prepareFormData();
            const response = await axios.post(
                `/general/members/${member.id}`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            Swal.fire({
                title: "Success!",
                text: response.data.message,
                icon: "success",
                confirmButtonText: "OK",
            });
        } catch (error) {
            if (error.response && error.response.data.errors) {
                setErrors(error.response.data.errors); // Ensure correct structure
            }

            Swal.fire({
                title: "Error!",
                text:
                    error.response?.data.message ||
                    "Update failed. Please try again.",
                icon: "error",
                confirmButtonText: "OK",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AdminDashboardLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold">
                    BM Ex-Students Edit Form
                </h2>
            }
        >
            <Head title=" BM Ex-Students Registration" />
            <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-2">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                    Edit Form
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div>
                            <label className="block">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={data.name}
                                onChange={handleChange}
                                className="border rounded w-full p-2"
                            />
                            {errors.name && (
                                <div className="text-red-600">
                                    {errors.name}
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block">Father Name</label>
                            <input
                                type="text"
                                name="father_name"
                                value={data.father_name}
                                onChange={handleChange}
                                className="border rounded w-full p-2"
                            />
                            {errors.father_name && (
                                <div className="text-red-600">
                                    {errors.father_name}
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block">Mother Name</label>
                            <input
                                type="text"
                                name="mother_name"
                                value={data.mother_name}
                                onChange={handleChange}
                                className="border rounded w-full p-2"
                            />
                            {errors.mother_name && (
                                <div className="text-red-600">
                                    {errors.mother_name}
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block">Mobile Number</label>
                            <input
                                type="text"
                                name="mobile_no"
                                value={data.mobile_no}
                                onChange={handleChange}
                                className="border rounded w-full p-2"
                            />
                            {errors.mobile_no && (
                                <div className="text-red-600">
                                    {errors.mobile_no}
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block">NID Number</label>
                            <input
                                type="text"
                                name="nid_no"
                                value={data.nid_no}
                                onChange={handleChange}
                                className="border rounded w-full p-2"
                            />
                            {errors.nid_no && (
                                <div className="text-red-600">
                                    {errors.nid_no}
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={data.email}
                                onChange={handleChange}
                                className="border rounded w-full p-2"
                            />
                            {errors.email && (
                                <div className="text-red-600">
                                    {errors.email}
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block">Occupation</label>
                            <input
                                type="text"
                                name="occupation"
                                value={data.occupation}
                                onChange={handleChange}
                                className="border rounded w-full p-2"
                            />
                            {errors.occupation && (
                                <div className="text-red-600">
                                    {errors.occupation}
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block">Reg Date</label>
                            <input
                                type="date"
                                name="reg_date"
                                value={data.reg_date}
                                onChange={handleChange}
                                className="border rounded w-full p-2"
                            />
                            {errors.reg_date && (
                                <div className="text-red-600">
                                    {errors.reg_date}
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block">Approval Date</label>
                            <input
                                type="date"
                                name="approval_date"
                                value={data.approval_date}
                                onChange={handleChange}
                                className="border rounded w-full p-2"
                            />
                            {errors.approval_date && (
                                <div className="text-red-600">
                                    {errors.approval_date}
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Status
                            </label>
                            <select
                                value={data.status}
                                onChange={(e) =>
                                    setData((prevData) => ({
                                        ...prevData,
                                        status: e.target.value,
                                    }))
                                }
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="Pending">Pending</option>
                                <option value="Approved">Approved</option>
                            </select>
                            {errors.status && (
                                <span className="text-xs text-red-500">
                                    {errors.status}
                                </span>
                            )}
                        </div>

                        {/* District Dropdown */}
                        <div className="lg:col-span-1 md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Select District
                            </label>
                            <select
                                value={selectedDistrict?.id || ""}
                                onChange={handleDistrictChange}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="">Select District</option>
                                {districts.map((district) => (
                                    <option
                                        key={district.id}
                                        value={district.id}
                                    >
                                        {district.name}
                                    </option>
                                ))}
                            </select>
                            {errors.district && (
                                <span className="text-xs text-red-500">
                                    {errors.district}
                                </span>
                            )}
                        </div>

                        {/* Upazila Dropdown */}
                        <div className="lg:col-span-1 md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Select Upazila
                            </label>
                            <select
                                value={data.upazila}
                                onChange={(e) =>
                                    setData((prevData) => ({
                                        ...prevData,
                                        upazila: e.target.value,
                                    }))
                                }
                                className={`mt-1 block w-full rounded-md border ${
                                    errors.upazila
                                        ? "border-red-500"
                                        : "border-gray-300"
                                } shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
                            >
                                <option value="">Select Upazila</option>
                                {selectedDistrict &&
                                    selectedDistrict.thanas.map((thana) => (
                                        <option
                                            key={thana.id}
                                            value={thana.name}
                                        >
                                            {thana.name}
                                        </option>
                                    ))}
                            </select>
                            {errors.upazila && (
                                <span className="text-sm text-red-500">
                                    {errors.upazila}
                                </span>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Blood Group
                            </label>
                            <select
                                value={data.blood_group}
                                onChange={(e) =>
                                    setData((prevData) => ({
                                        ...prevData,
                                        blood_group: e.target.value,
                                    }))
                                }
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="">Select Blood Group</option>
                                <option value="A+">A+</option>
                                <option value="A-">A-</option>
                                <option value="B+">B+</option>
                                <option value="B-">B-</option>
                                <option value="AB+">AB+</option>
                                <option value="AB-">AB-</option>
                                <option value="O+">O+</option>
                                <option value="O-">O-</option>
                            </select>
                            {errors.blood_group && (
                                <span className="text-xs text-red-500">
                                    {errors.blood_group}
                                </span>
                            )}
                        </div>

                        {/* Dakhil Year */}
                        <div>
                            <label className="block">Dakhil Year</label>
                            <input
                                type="number"
                                name="dakhil_year"
                                value={data.dakhil_year}
                                onChange={handleChange}
                                className="border rounded w-full p-2"
                                min="1900"
                                max="2099"
                            />
                            {errors.dakhil_year && (
                                <div className="text-red-600">
                                    {errors.dakhil_year}
                                </div>
                            )}
                        </div>

                        {/* Alim Year */}
                        <div>
                            <label className="block">Alim Year</label>
                            <input
                                type="number"
                                name="alim_year"
                                value={data.alim_year}
                                onChange={handleChange}
                                className="border rounded w-full p-2"
                                min="1900"
                                max="2099"
                            />
                            {errors.alim_year && (
                                <div className="text-red-600">
                                    {errors.alim_year}
                                </div>
                            )}
                        </div>

                        {/* Fazil Year */}
                        <div>
                            <label className="block">Fazil Year</label>
                            <input
                                type="number"
                                name="fazil_year"
                                value={data.fazil_year}
                                onChange={handleChange}
                                className="border rounded w-full p-2"
                                min="1900"
                                max="2099"
                            />
                            {errors.fazil_year && (
                                <div className="text-red-600">
                                    {errors.fazil_year}
                                </div>
                            )}
                        </div>

                        {/* Date of Birth */}
                        <div>
                            <label className="block">Date of Birth</label>
                            <input
                                type="date"
                                name="date_of_birth"
                                value={data.date_of_birth}
                                onChange={handleChange}
                                className="border rounded w-full p-2"
                            />
                            {errors.date_of_birth && (
                                <div className="text-red-600">
                                    {errors.date_of_birth}
                                </div>
                            )}
                        </div>

                        {/* Gender */}
                        <div>
                            <label className="block">Gender</label>
                            <select
                                name="gender"
                                value={data.gender}
                                onChange={handleChange}
                                className="border rounded w-full p-2"
                            >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                            {errors.gender && (
                                <div className="text-red-600">
                                    {errors.gender}
                                </div>
                            )}
                        </div>

                        {/* Union or Pourshava */}
                        <div>
                            <label className="block">Union or Pourshava</label>
                            <input
                                type="text"
                                name="union_or_pourshava"
                                value={data.union_or_pourshava}
                                onChange={handleChange}
                                className="border rounded w-full p-2"
                            />
                            {errors.union_or_pourshava && (
                                <div className="text-red-600">
                                    {errors.union_or_pourshava}
                                </div>
                            )}
                        </div>

                        {/* Post Office */}
                        <div>
                            <label className="block">Post Office</label>
                            <input
                                type="text"
                                name="post_office"
                                value={data.post_office}
                                onChange={handleChange}
                                className="border rounded w-full p-2"
                            />
                            {errors.post_office && (
                                <div className="text-red-600">
                                    {errors.post_office}
                                </div>
                            )}
                        </div>

                        {/* Ward No */}
                        <div>
                            <label className="block">Ward No</label>
                            <input
                                type="number"
                                name="ward_no"
                                value={data.ward_no}
                                onChange={handleChange}
                                className="border rounded w-full p-2"
                                min="1"
                                max="100"
                            />
                            {errors.ward_no && (
                                <div className="text-red-600">
                                    {errors.ward_no}
                                </div>
                            )}
                        </div>

                        {/* House No or Name */}
                        <div>
                            <label className="block">House No or Name</label>
                            <input
                                type="text"
                                name="house_no_or_name"
                                value={data.house_no_or_name}
                                onChange={handleChange}
                                className="border rounded w-full p-2"
                            />
                            {errors.house_no_or_name && (
                                <div className="text-red-600">
                                    {errors.house_no_or_name}
                                </div>
                            )}
                        </div>

                        {/* Present Address */}
                        <div>
                            <label className="block">Present Address</label>
                            <input
                                type="text"
                                name="present_address"
                                value={data.present_address}
                                onChange={handleChange}
                                className="border rounded w-full p-2"
                            />
                            {errors.present_address && (
                                <div className="text-red-600">
                                    {errors.present_address}
                                </div>
                            )}
                        </div>

                        {/* Membership Fee */}
                        <div>
                            <label className="block">Membership Fee</label>
                            <input
                                type="number"
                                name="membership_fee"
                                value={data.membership_fee}
                                onChange={handleChange}
                                className="border rounded w-full p-2"
                                min="0"
                            />
                            {errors.membership_fee && (
                                <div className="text-red-600">
                                    {errors.membership_fee}
                                </div>
                            )}
                        </div>

                        {/* Transaction No */}
                        <div>
                            <label className="block">Transaction No</label>
                            <input
                                type="text"
                                name="transaction_no"
                                value={data.transaction_no}
                                onChange={handleChange}
                                className="border rounded w-full p-2"
                            />
                            {errors.transaction_no && (
                                <div className="text-red-600">
                                    {errors.transaction_no}
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block font-medium text-gray-700">
                                Image
                            </label>
                            <input
                                type="file"
                                name="image"
                                onChange={handleImageChange}
                                className="mt-1 block w-full border rounded p-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                            />
                            {preview && (
                                <div className="mt-4 flex justify-center">
                                    <img
                                        src={preview}
                                        alt="Preview"
                                        className="h-40 w-40 object-cover border rounded shadow-md"
                                    />
                                </div>
                            )}
                            {errors.image && (
                                <div className="text-red-600 text-sm mt-1">
                                    {errors.image}
                                </div>
                            )}
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white rounded px-4 py-2 w-full"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Updating..." : "Update General Member"}
                    </button>
                </form>
            </div>
        </AdminDashboardLayout>
    );
};

export default EditBmExStudents;
