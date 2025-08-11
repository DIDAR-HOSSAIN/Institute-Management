import AdminDashboardLayout from "@/backend/Dashboard/AdminDashboardLayout";
import CustomDatePicker from "@/Components/DatePicker";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import { Head, usePage } from "@inertiajs/react";
import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import "react-datepicker/dist/react-datepicker.css";
import { format, parseISO } from "date-fns";

const EditProduct = ({ auth, categories = [], product }) => {
    const { message } = usePage().props;

    const [data, setData] = useState({
        product_id: product.product_id || "",
        product_name: product.product_name || "",
        category_name: product.category_name || "",
        // sku: product.sku || "",
        purchase_date: product.purchase_date
            ? product.purchase_date.split("T")[0]
            : "",
        supplier_name: product.supplier_name || "",
        // slug: product.slug || "",
        description: product.description || "",
        image1: null,
        image2: null,
        image3: null,
        image4: null,
        image5: null,
        stock_in: product.stock_in || 0,
        stock_out: product.stock_out || 0,
        purchase_price: product.purchase_price || 0,
        sales_price: product.sales_price || 0,
        previous_price: product.previous_price || 0,
        profit: product.profit || 0,
    });

    const [preview, setPreview] = useState({
        image1: product.image1 ? `/public/images/products/${product.image1}` : null,
        image2: product.image2 ? `/public/images/products/${product.image2}` : null,
        image3: product.image3 ? `/public/images/products/${product.image3}` : null,
        image4: product.image4 ? `/public/images/products/${product.image4}` : null,
        image5: product.image5 ? `/public/images/products/${product.image5}` : null,
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [entryDate, setEntryDate] = useState(
        product.purchase_date ? parseISO(product.purchase_date) : new Date()
    );
    
    
    const handleDateChange = (date, field) => {
        setEntryDate(date);
        setData((prevData) => ({
            ...prevData,
            [field]: date ? format(date, "yyyy-MM-dd") : "",
        }));
    };
  

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleImageChange = (e, imageField) => {
        const file = e.target.files[0];
        if (file) {
            setData((prevData) => ({ ...prevData, [imageField]: file })); // Dynamically update the image field
            setPreview((prevPreviews) => ({
                ...prevPreviews,
                [imageField]: URL.createObjectURL(file), // Set the preview dynamically
            }));
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

    const calculateProfit = () => {
        const profit =
            parseFloat(data.sales_price || 0) - parseFloat(data.purchase_price || 0);
        setData((prevData) => ({
            ...prevData,
            profit: profit, // Ensure profit is a string with two decimal places
        }));
    };


    useEffect(() => {
        calculateProfit();
    }, [data.purchase_price, data.sales_price]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        try {
            const formData = prepareFormData();
            const response = await axios.post(
                `/products/${product.id}`,
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
                setErrors(error.response.data.errors);
            }

            Swal.fire({
                title: "Error!",
                text: error.response?.data.message || "Update failed. Please try again.",
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
                <h1 className="font-semibold text-xl text-gray-800 leading-tight">
                    Edit Product
                </h1>
            }
        >
            <Head title="Edit Product" />
            <div className="py-6">
                {message && (
                    <div
                        className="bg-teal-100 border-t-4 border-teal-500 rounded-b text-teal-900 px-4 py-3 shadow-md my-3"
                        role="alert"
                    >
                        <div>
                            <p className="text-sm">{message}</p>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Product Name */}
                        <div>
                            <InputLabel
                                htmlFor="product_name"
                                value="Product Name"
                            />
                            <TextInput
                                id="product_name"
                                name="product_name"
                                value={data.product_name}
                                className="mt-1 block w-full"
                                autoComplete="product_name"
                                onChange={handleChange}
                                required
                            />
                            <InputError
                                message={errors.product_name}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel
                                htmlFor="category_name"
                                value="Category"
                            />
                            <select
                                id="category_name"
                                name="category_name"
                                value={data.category_name || ""}
                                className="..."
                                onChange={handleChange}
                            >
                                <option value="">
                                    Select Product Category
                                </option>
                                {categories.map((category) => (
                                    <option
                                        key={category.id}
                                        value={category.category_name}
                                    >
                                        {category.category_name}
                                    </option>
                                ))}
                            </select>

                            <InputError
                                message={errors.category_name}
                                className="mt-2"
                            />
                        </div>

                        {/* <div>
                            <InputLabel htmlFor="sku" value="SKU" />
                            <TextInput
                                id="sku"
                                name="sku"
                                value={data.sku}
                                className="mt-1 block w-full"
                                autoComplete="sku"
                                onChange={handleChange}
                            />
                            <InputError message={errors.sku} className="mt-2" />
                        </div> */}

                        <div>
                            <InputLabel
                                htmlFor="purchase_date"
                                value="Purchase Date"
                            />
                            <CustomDatePicker
                                selectedDate={entryDate}
                                handleDateChange={(date) =>
                                    handleDateChange(date, "purchase_date")
                                }
                            />
                            <InputError
                                message={errors.purchase_date}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel
                                htmlFor="supplier_name"
                                value="Supplier Name"
                            />
                            <TextInput
                                id="supplier_name"
                                name="supplier_name"
                                value={data.supplier_name}
                                className="mt-1 block w-full"
                                autoComplete="supplier_name"
                                onChange={handleChange}
                            />
                            <InputError
                                message={errors.supplier_name}
                                className="mt-2"
                            />
                        </div>

                        {/* <div>
                            <InputLabel htmlFor="slug" value="Slug" />
                            <TextInput
                                id="slug"
                                name="slug"
                                value={data.slug}
                                className="mt-1 block w-full"
                                autoComplete="slug"
                                onChange={handleChange}
                            />
                            <InputError message={errors.slug} className="mt-2" />
                        </div> */}

                        <div>
                            <InputLabel
                                htmlFor="description"
                                value="Description"
                            />
                            <TextInput
                                id="description"
                                name="description"
                                value={data.description}
                                className="mt-1 block w-full"
                                autoComplete="description"
                                onChange={handleChange}
                            />
                            <InputError
                                message={errors.description}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel htmlFor="stock_in" value="Stock In" />
                            <TextInput
                                id="stock_in"
                                type="number"
                                name="stock_in"
                                value={data.stock_in}
                                className="mt-1 block w-full"
                                onChange={handleChange}
                            />
                            <InputError
                                message={errors.stock_in}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel htmlFor="stock_out" value="Stock Out" />
                            <TextInput
                                id="stock_out"
                                type="number"
                                name="stock_out"
                                value={data.stock_out}
                                className="mt-1 block w-full"
                                onChange={handleChange}
                            />
                            <InputError
                                message={errors.stock_out}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel
                                htmlFor="purchase_price"
                                value="Purchase Price"
                            />
                            <TextInput
                                id="purchase_price"
                                type="number"
                                name="purchase_price"
                                value={data.purchase_price}
                                className="mt-1 block w-full"
                                onChange={handleChange}
                                required
                            />
                            <InputError
                                message={errors.purchase_price}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel
                                htmlFor="sales_price"
                                value="Sales Price"
                            />
                            <TextInput
                                id="sales_price"
                                type="number"
                                name="sales_price"
                                value={data.sales_price}
                                className="mt-1 block w-full"
                                onChange={handleChange}
                                required
                            />
                            <InputError
                                message={errors.sales_price}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel
                                htmlFor="previous_price"
                                value="Previous Price"
                            />
                            <TextInput
                                id="previous_price"
                                type="number"
                                name="previous_price"
                                value={data.previous_price}
                                className="mt-1 block w-full"
                                onChange={handleChange}
                                required
                            />
                            <InputError
                                message={errors.previous_price}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel htmlFor="profit" value="Profit" />
                            <TextInput
                                id="profit"
                                type="number"
                                name="profit"
                                value={data.profit}
                                className="mt-1 block w-full"
                                onChange={handleChange}
                                required
                            />
                            <InputError
                                message={errors.profit}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <label htmlFor="image1">Image 1</label>
                            <input
                                type="file"
                                id="image1"
                                name="image1"
                                onChange={(e) => handleImageChange(e, "image1")}
                            />
                            {preview.image1 && (
                                <img
                                    src={preview.image1}
                                    alt="Preview 1"
                                    className="w-24 h-24 object-cover"
                                />
                            )}
                        </div>

                        <div>
                            <label htmlFor="image2">Image 2</label>
                            <input
                                type="file"
                                id="image2"
                                name="image2"
                                onChange={(e) => handleImageChange(e, "image2")}
                            />
                            {preview.image2 && (
                                <img
                                    src={preview.image2}
                                    alt="Preview 2"
                                    className="w-24 h-24 object-cover"
                                />
                            )}
                        </div>

                        <div>
                            <label htmlFor="image3">Image 3</label>
                            <input
                                type="file"
                                id="image3"
                                name="image3"
                                onChange={(e) => handleImageChange(e, "image3")}
                            />
                            {preview.image3 && (
                                <img
                                    src={preview.image3}
                                    alt="Preview 3"
                                    className="w-24 h-24 object-cover"
                                />
                            )}
                        </div>

                        <div>
                            <label htmlFor="image4">Image 4</label>
                            <input
                                type="file"
                                id="image4"
                                name="image4"
                                onChange={(e) => handleImageChange(e, "image4")}
                            />
                            {preview.image4 && (
                                <img
                                    src={preview.image4}
                                    alt="Preview 4"
                                    className="w-24 h-24 object-cover"
                                />
                            )}
                        </div>

                        <div>
                            <label htmlFor="image5">Image 5</label>
                            <input
                                type="file"
                                id="image5"
                                name="image5"
                                onChange={(e) => handleImageChange(e, "image5")}
                            />
                            {preview.image5 && (
                                <img
                                    src={preview.image5}
                                    alt="Preview 5"
                                    className="w-24 h-24 object-cover"
                                />
                            )}
                        </div>

                    </div>

                    <div className="mt-6 flex justify-end">
                        <button
                            type="submit"
                            className="bg-blue-500 text-white rounded px-4 py-2 w-full"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Updating..." : "Update Product"}
                        </button>
                    </div>
                </form>
            </div>
        </AdminDashboardLayout>
    );
};

export default EditProduct;
