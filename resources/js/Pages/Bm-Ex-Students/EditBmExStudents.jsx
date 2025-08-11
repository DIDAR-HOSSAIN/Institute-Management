import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminDashboardLayout from "@/backend/Dashboard/AdminDashboardLayout";
import { Head, usePage } from "@inertiajs/react";
import Swal from "sweetalert2";

const EditBmExStudents = ({ auth, member, districts }) => {
    const { message, errors } = usePage().props;
    console.log('errors', errors);

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
    const [imagePreview, setImagePreview] = useState(
        member.image ? `/images/students/${member.image}` : null
    );

    // const [errors, setErrors] = useState({});
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

    const handleInputChange = (e) => {
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
            setImagePreview(URL.createObjectURL(file));
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
                    General Member Update
                </h2>
            }
        >
            <Head title="General Member Update" />

            {/* Success Message */}
            {message && (
                <div className="bg-teal-100 border-t-4 border-teal-500 text-teal-900 px-4 py-3 my-3">
                    <p>{message}</p>
                </div>
            )}

            {/* Error Messages */}
            {Object.keys(errors).length > 0 && (
                <div className="bg-red-100 border-t-4 border-red-500 text-red-900 px-4 py-3 my-3">
                    <ul>
                        {Object.keys(errors).map((field, index) => (
                            <li key={index}>{errors[field]}</li>
                        ))}
                    </ul>
                </div>
            )}

            <form
                onSubmit={handleSubmit}
                className="max-w-6xl mx-auto bg-white p-6 shadow-lg rounded-lg mt-2"
            >
                <h2 className="text-2xl font-semibold text-center">
                    Register New Member
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {/* Personal Information */}
                    <div className="">
                        <label className="block text-sm font-medium text-gray-700">
                            Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={data.name}
                            onChange={handleInputChange}
                            className="input-field w-full"
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Father's Name<span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="father_name"
                            value={data.father_name}
                            onChange={handleInputChange}
                            className="input-field w-full"
                        />
                        {errors.father_name && (
                            <p className="text-red-500 text-sm">
                                {errors.father_name}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Mother's Name<span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="mother_name"
                            value={data.mother_name}
                            onChange={handleInputChange}
                            className="input-field w-full"
                        />
                        {errors.mother_name && (
                            <p className="text-red-500 text-sm">
                                {errors.mother_name}
                            </p>
                        )}
                    </div>

                    {/* Date of Birth Field */}
                    <div>
                        <label className="block">Date of Birth</label>
                        <input
                            type="date"
                            name="date_of_birth"
                            value={data.date_of_birth}
                            onChange={handleInputChange}
                            className="border rounded w-full p-2"
                        />
                        {errors.date_of_birth && (
                            <div className="text-red-600">
                                {errors.date_of_birth}
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Gender<span className="text-red-500">*</span>
                        </label>
                        <select
                            name="gender"
                            value={data.gender}
                            onChange={handleInputChange}
                            className="input-field w-full"
                        >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                        {errors.gender && (
                            <p className="text-red-500 text-sm">
                                {errors.gender}
                            </p>
                        )}
                    </div>

                    {/* Contact Information */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Mobile No<span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            name="mobile_no"
                            value={data.mobile_no}
                            onChange={handleInputChange}
                            onWheel={(e) => e.target.blur()}
                            className="input-field w-full"
                        />
                        {errors.mobile_no && (
                            <p className="text-red-500 text-sm">
                                {errors.mobile_no}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            NID No
                        </label>
                        <input
                            type="number"
                            name="nid_no"
                            value={data.nid_no}
                            onChange={handleInputChange}
                            onWheel={(e) => e.target.blur()}
                            className="input-field w-full"
                        />
                        {errors.nid_no && (
                            <p className="text-red-500 text-sm">
                                {errors.nid_no}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={data.email}
                            onChange={handleInputChange}
                            className="input-field w-full"
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block">Reg Date</label>
                        <input
                            type="date"
                            name="reg_date"
                            value={data.reg_date}
                            onChange={handleInputChange}
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
                            onChange={handleInputChange}
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
                                <option key={district.id} value={district.id}>
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
                            className={`mt-1 block w-full rounded-md border ${errors.upazila
                                    ? "border-red-500"
                                    : "border-gray-300"
                                } shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
                        >
                            <option value="">Select Upazila</option>
                            {selectedDistrict &&
                                selectedDistrict.thanas.map((thana) => (
                                    <option key={thana.id} value={thana.name}>
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
                            Occupation
                        </label>
                        <input
                            type="text"
                            name="occupation"
                            value={data.occupation}
                            onChange={handleInputChange}
                            className="input-field w-full"
                        />
                        {errors.occupation && (
                            <p className="text-red-500 text-sm">
                                {errors.occupation}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Union or Pourshava
                        </label>
                        <input
                            name="union_or_pourshava"
                            value={data.union_or_pourshava}
                            onChange={handleInputChange}
                            className="input-field w-full"
                        ></input>
                        {errors.union_or_pourshava && (
                            <p className="text-red-500 text-sm">
                                {errors.union_or_pourshava}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Post Office
                        </label>
                        <input
                            name="post_office"
                            value={data.post_office}
                            onChange={handleInputChange}
                            className="input-field w-full"
                        ></input>
                        {errors.post_office && (
                            <p className="text-red-500 text-sm">
                                {errors.post_office}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Ward No
                        </label>
                        <input
                            name="ward_no"
                            value={data.ward_no}
                            onChange={handleInputChange}
                            className="input-field w-full"
                        ></input>
                        {errors.ward_no && (
                            <p className="text-red-500 text-sm">
                                {errors.ward_no}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            House No Or Name
                        </label>
                        <input
                            name="house_no_or_name"
                            value={data.house_no_or_name}
                            onChange={handleInputChange}
                            className="input-field w-full"
                        ></input>
                        {errors.house_no_or_name && (
                            <p className="text-red-500 text-sm">
                                {errors.house_no_or_name}
                            </p>
                        )}
                    </div>

                    {/* Blood Group Dropdown */}
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

                    {/* Educational Information */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Dakhil Year
                        </label>
                        <input
                            type="text"
                            name="dakhil_year"
                            value={data.dakhil_year}
                            onChange={handleInputChange}
                            className="input-field w-full"
                        />
                        {errors.dakhil_year && (
                            <p className="text-red-500 text-sm">
                                {errors.dakhil_year}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Alim Year
                        </label>
                        <input
                            type="text"
                            name="alim_year"
                            value={data.alim_year}
                            onChange={handleInputChange}
                            className="input-field w-full"
                        />
                        {errors.alim_year && (
                            <p className="text-red-500 text-sm">
                                {errors.alim_year}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Fazil Year
                        </label>
                        <input
                            type="text"
                            name="fazil_year"
                            value={data.fazil_year}
                            onChange={handleInputChange}
                            className="input-field w-full"
                        />
                        {errors.fazil_year && (
                            <p className="text-red-500 text-sm">
                                {errors.fazil_year}
                            </p>
                        )}
                    </div>

                    {/* Membership Fee & Status */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Membership Fee{" "}
                            <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            name="membership_fee"
                            value={data.membership_fee}
                            readOnly
                            className="input-field w-full bg-gray-100"
                        />
                        {errors.membership_fee && (
                            <p className="text-red-500 text-sm">
                                {errors.membership_fee}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Transaction No{" "}
                            <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="transaction_no"
                            value={data.transaction_no}
                            onChange={handleInputChange}
                            className="input-field w-full"
                        />
                        {errors.transaction_no && (
                            <p className="text-red-500 text-sm">
                                {errors.transaction_no}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Present Address
                        </label>
                        <textarea
                            name="present_address"
                            value={data.present_address}
                            onChange={handleInputChange}
                            className="input-field w-full"
                        ></textarea>
                        {errors.present_address && (
                            <p className="text-red-500 text-sm">
                                {errors.present_address}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Upload Image
                        </label>
                        <input
                            type="file"
                            name="image"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="mt-1 block w-full text-gray-700"
                        />

                        {imagePreview && (
                            <img
                                src={imagePreview}
                                alt="Preview"
                                className="mt-2 h-32 w-32 object-cover"
                            />
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
        </AdminDashboardLayout>
    );
};

export default EditBmExStudents;
