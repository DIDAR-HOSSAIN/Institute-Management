import React, { useState } from "react";
import axios from "axios";
import AdminDashboardLayout from "@/backend/Dashboard/AdminDashboardLayout";
import { Head } from "@inertiajs/react";

const EditSlider = ({ auth, slider }) => {
    const [data, setData] = useState({
        slider_name: slider.slider_name || "",
        status: slider.status !== undefined ? slider.status : "1", // Default to "1" (Active)
        image: null,
    });
    const [preview, setPreview] = useState(slider.image ? `/images/slider/${slider.image}` : null);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData((prev) => ({ ...prev, image: file }));
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        const formData = new FormData();
        formData.append("_method", "PUT");
        formData.append("slider_name", data.slider_name);
        formData.append("status", data.status);
        if (data.image) {
            formData.append("image", data.image);
        }

        try {
            const response = await axios.post(`/sliders/${slider.id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            alert(response.data.message);
        } catch (error) {
            if (error.response && error.response.data.errors) {
                setErrors(error.response.data.errors);
            } else {
                console.error("An error occurred:", error);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AdminDashboardLayout
            user={auth.user}
            header={
                <h1 className="font-semibold text-xl text-gray-800 leading-tight">
                    Edit Slider
                </h1>
            }
        >
            <Head title="Edit Slider" />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Slider</h2>
                <form
                    onSubmit={handleSubmit}
                    className="bg-white shadow-md rounded-lg p-6 space-y-6"
                >
                    {/* Slider Name */}
                    <div>
                        <label htmlFor="slider_name" className="block text-sm font-medium text-gray-700">
                            Slider Name
                        </label>
                        <input
                            type="text"
                            id="slider_name"
                            name="slider_name"
                            value={data.slider_name}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Enter slider name"
                        />
                        {errors.slider_name && (
                            <p className="text-red-600 text-sm mt-1">{errors.slider_name}</p>
                        )}
                    </div>

                    {/* Status */}
                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                            Status
                        </label>
                        <select
                            id="status"
                            name="status"
                            value={data.status}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                            <option value="1">Active</option>
                            <option value="0">Inactive</option>
                        </select>
                        {errors.status && <p className="text-red-600 text-sm mt-1">{errors.status}</p>}
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                            Upload Image
                        </label>
                        <input
                            type="file"
                            id="image"
                            name="image"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="mt-1 block w-full text-gray-600 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                        {preview && (
                            <img
                                src={preview}
                                alt="Preview"
                                className="mt-4 h-40 w-40 object-cover rounded-lg shadow-md"
                            />
                        )}
                        {errors.image && <p className="text-red-600 text-sm mt-1">{errors.image}</p>}
                    </div>

                    {/* Submit Button */}
                    <div className="text-right">
                        <button
                            type="submit"
                            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${isSubmitting
                                    ? "bg-blue-400 cursor-not-allowed"
                                    : "bg-blue-500 hover:bg-blue-600"
                                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Updating..." : "Update Slider"}
                        </button>
                    </div>
                </form>
            </div>
        </AdminDashboardLayout>
    );
};

export default EditSlider;
