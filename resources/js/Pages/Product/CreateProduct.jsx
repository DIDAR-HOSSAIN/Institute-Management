
import AdminDashboardLayout from "@/backend/Dashboard/AdminDashboardLayout";
import CustomDatePicker from "@/Components/DatePicker";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import { Head, useForm, usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";

const CreateProduct = ({ auth, categories }) => {
    const { message } = usePage().props;
    const [entryDate, setEntryDate] = useState(new Date());
    const { data, setData, post, processing, errors, reset } = useForm({
        product_id: "",
        product_name: "",
        category_name: "",
        sku: "",
        purchase_date: "",
        supplier_name: "",
        description: "",
        // slug: "",
        image1: null,
        image2: null,
        image3: null,
        image4: null,
        image5: null,
        stock_in: 0,
        stock_out: 0,
        purchase_price: 0,
        sales_price: 0,
        previous_price: 0,
        profit: 0,
    });

    const handleDateChange = (date, field) => {
        if (field === "purchase_date") {
            setEntryDate(date);
            setData(field, date ? date.toISOString().split("T")[0] : null);
        }
    };

    const calculateProfit = () => {
        const profit =
            parseFloat(data.sales_price || 0) -
            parseFloat(data.purchase_price || 0);
        setData("profit", profit);
    };

    useEffect(() => {
        calculateProfit();
    }, [data.purchase_price, data.sales_price]);

    const submit = (e) => {
        e.preventDefault();
        post(route("products.store"), {
            onSuccess: (page) => {
                console.log("Form submitted successfully:", page);
                reset();
            },
            onError: (errors) => {
                console.log("Form Submission errors:", errors);
            },
        });
    };

    return (
        <AdminDashboardLayout
            user={auth.user}
            header={
                <h1 className="font-semibold text-xl text-gray-800 leading-tight">
                    Product Entry
                </h1>
            }
        >
            <Head title="Product Entry" />
            <div className="py-6">
                {message && (
                    <div
                        className="bg-teal-100 border-t-4 border-teal-500 rounded-b text-teal-900 px-4 py-3 shadow-md my-3"
                        role="alert"
                    >
                        <div className="flex">
                            <div>
                                <p className="text-sm">{message}</p>
                            </div>
                        </div>
                    </div>
                )}

                {errors.error && (
                    <div
                        className="bg-teal-100 border-t-4 border-teal-500 rounded-b text-teal-900 px-4 py-3 shadow-md my-3"
                        role="alert"
                    >
                        <div className="flex">
                            <div>
                                <p className="text-sm">{errors.error}</p>
                            </div>
                        </div>
                    </div>
                )}

                <form onSubmit={submit}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
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
                                onChange={(e) =>
                                    setData("product_name", e.target.value)
                                }
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
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                onChange={(e) =>
                                    setData("category_name", e.target.value)
                                }
                                value={data.category_name}
                            >
                                <option value="">
                                    Select Product Category
                                </option>
                                {categories?.map((category) => (
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
                                onChange={(e) =>
                                    setData("sku", e.target.value.toUpperCase())
                                }
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
                                onChange={(e) =>
                                    setData(
                                        "supplier_name",
                                        e.target.value
                                    )
                                }
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
                                onChange={(e) =>
                                    setData("slug", e.target.value)
                                }
                            />
                            <InputError
                                message={errors.slug}
                                className="mt-2"
                            />
                        </div> */}

                        <div className="lg:col-span-2 row-span-2">
                            <InputLabel
                                htmlFor="description"
                                value="Description"
                            />
                            <textarea
                                id="description"
                                name="description"
                                value={data.description}
                                className="mt-1 block w-full"
                                autoComplete="description"
                                onChange={(e) =>
                                    setData("description", e.target.value)
                                }
                            />
                            <InputError
                                message={errors.description}
                                className="mt-2"
                            />
                        </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
                        <div>
                            <InputLabel htmlFor="image1" value="Image 1" />
                            <input
                                type="file"
                                name="image1"
                                className="mt-1 block w-full"
                                onChange={(e) =>
                                    setData("image1", e.target.files[0])
                                }
                            />
                            <InputError
                                message={errors.image1}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel htmlFor="image2" value="Image 2" />
                            <input
                                type="file"
                                name="image2"
                                className="mt-1 block w-full"
                                onChange={(e) =>
                                    setData("image2", e.target.files[0])
                                }
                            />
                            <InputError
                                message={errors.image2}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel htmlFor="image3" value="Image 3" />
                            <input
                                type="file"
                                name="image3"
                                className="mt-1 block w-full"
                                onChange={(e) =>
                                    setData("image3", e.target.files[0])
                                }
                            />
                            <InputError
                                message={errors.image3}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel htmlFor="image4" value="Image 4" />
                            <input
                                type="file"
                                name="image4"
                                className="mt-1 block w-full"
                                onChange={(e) =>
                                    setData("image4", e.target.files[0])
                                }
                            />
                            <InputError
                                message={errors.image4}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel htmlFor="image5" value="Image 5" />
                            <input
                                type="file"
                                name="image5"
                                className="mt-1 block w-full"
                                onChange={(e) =>
                                    setData("image5", e.target.files[0])
                                }
                            />
                            <InputError
                                message={errors.image5}
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
                                onChange={(e) =>
                                    setData("stock_in", e.target.value)
                                }
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
                                onChange={(e) =>
                                    setData("stock_out", e.target.value)
                                }
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
                                onChange={(e) =>
                                    setData("purchase_price", e.target.value)
                                }
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
                                onChange={(e) =>
                                    setData("sales_price", e.target.value)
                                }
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
                                onChange={(e) =>
                                    setData("previous_price", e.target.value)
                                }
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
                                onChange={(e) =>
                                    setData("profit", e.target.value)
                                }
                                required
                            />
                            <InputError
                                message={errors.profit}
                                className="mt-2"
                            />
                        </div>
                    </div>

                    <button
                        className="mx-auto block w-full mt-2 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold transition duration-300"
                        disabled={processing}
                    >
                        {processing ? "Processing..." : "Submit"}
                    </button>
                </form>
            </div>
        </AdminDashboardLayout>
    );
};

export default CreateProduct;
