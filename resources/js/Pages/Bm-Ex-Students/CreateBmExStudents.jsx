import React, { useState } from "react";
import { Head, useForm, usePage } from "@inertiajs/react";
import AdminDashboardLayout from "@/backend/Dashboard/AdminDashboardLayout";
import { format } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import NormalDatePicker from "@/Components/NormalDatePicker";

const CreateBmExStudents = ({ auth, districts }) => {
    const { message, errors } = usePage().props;
    const [dob, setDob] = useState(new Date());
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const { data, setData, post, processing, reset } = useForm({
        name: "",
        father_name: "",
        mother_name: "",
        image: null,
        date_of_birth: "",
        gender: "",
        mobile_no: "",
        nid_no: "",
        email: "",
        blood_group: "",
        occupation: "",
        reg_date: "",
        approval_date: "",
        dakhil_year: "",
        alim_year: "",
        fazil_year: "",
        district: "",
        upazila: "",
        union_or_pourshava: "",
        post_office: "",
        ward_no: "",
        house_no_or_name: "",
        present_address: "",
        membership_fee: 300,
        transaction_no: "",
        status: "",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Convert to uppercase except for gender and email
        if (name === "gender") {
            setData(name, value); // Keep gender unchanged
        } else if (name === "email") {
            setData(name, value.toLowerCase()); // Convert email to lowercase
        } else {
            setData(name, value.toUpperCase()); // Convert all other fields to uppercase
        }
    };

    const handleDobChange = (date) => {
        setDob(date);
        const formattedDate = format(date, "yyyy-MM-dd");
        setData("date_of_birth", formattedDate);
    };

    const handleDistrictChange = (e) => {
        const districtId = e.target.value;
        const district = districts.find(
            (district) => district.id === parseInt(districtId)
        );
        setSelectedDistrict(district);
        setData("district", district ? district.name : "");
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        // Validate image file (optional)
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                setData((prevData) => ({
                    ...prevData,
                    image: file,
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("members.store"), {
            onSuccess: (page) => {
                console.log("Form submitted successfully:", page); // Logs the entire page response
                reset(); // Reset the form
            },
            onError: (errors) => {
                console.log("Submission errors:", errors); // Logs the validation or other errors
            },
        });
    };

    return (
        <AdminDashboardLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold">
                    General Member Registration
                </h2>
            }
        >
            <Head title="General Member Registration" />

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
                        <label className="block text-sm font-medium text-gray-700">
                            Date of Birth{" "}
                            <span className="text-red-500">*</span>
                        </label>
                        <NormalDatePicker
                            selectedDate={dob}
                            handleDateChange={handleDobChange}
                            className=""
                        />
                        {errors.date_of_birth && (
                            <p className="text-red-500 text-sm">
                                {errors.date_of_birth}
                            </p>
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

                    {/* Address Information */}
                    {/* Select District */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Select District{" "}
                            <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={selectedDistrict?.id || ""}
                            onChange={handleDistrictChange}
                            className="input-field w-full"
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

                    {/* Select Upazila */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Select Upazila{" "}
                            <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="upazila"
                            value={data.upazila}
                            onChange={(e) => setData("upazila", e.target.value)}
                            className={`input-field w-full ${
                                errors.upazila
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
                                setData("blood_group", e.target.value)
                            }
                            className="input-field w-full"
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
                    className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 w-full"
                >
                    Submit
                </button>
            </form>
        </AdminDashboardLayout>
    );
};

export default CreateBmExStudents;