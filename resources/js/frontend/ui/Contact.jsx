import axiosApi from "@/axios/axios";
import React, { useState } from "react";
import logo from "@/assets/images/Logo/bashiria-madrasah-prakton-logo.png";
import { Link } from "@inertiajs/react";

const Contact = () => {
    const [successMessage, setSuccessMessage] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        const form = event.target;
        const name = form.name.value;
        const email = form.email.value;
        const phone = form.phone.value;
        const inquiry = form.inquiry.value;

        try {
            const response = await axiosApi.post("/contacts", {
                name,
                email,
                phone,
                inquiry,
            });

            console.log(response.data); // You can handle the response as needed
            setSuccessMessage("Data added successfully.");
            form.reset(); // Reset the form fields
            setTimeout(() => {
                setSuccessMessage("");
            }, 5000);
        } catch (error) {
            console.error("Something went wrong:", error);
        }
    };

    return (
        <>
            <div className="grid gap-4 grid-cols-1 lg:grid-cols-2 place-items-center">
                {/* Left column */}
                <div className="text-center">
                    <Link to={"/"}>
                        <img
                            className="h-24 mx-auto mb-4"
                            src={logo}
                            alt="Bashiria Madrasah Logo"
                        />
                    </Link>
                    <h1 className="text-4xl font-bold text-center text-blue-600/100">
                        বশিরিয়া মাদ্রাসা প্রাক্তন ছাত্র-ছাত্রী পরিষদ
                    </h1>
                    <p className="text-lg">
                        রহমতপুর, সন্দ্বীপ , চট্টগ্রাম,
                    </p>
                    <p className="text-lg">E-Mail: bashiriamadrasah@gmail.com</p>
                    <p className="text-lg">
                        <a
                            href="https://www.facebook.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                color: "blue",
                                textDecoration: "underline",
                                cursor: "pointer",
                            }}
                        >
                            Visit our Facebook Page
                        </a>
                    </p>

                    <p className="text-lg">Mobile: +8801779479700</p>
                </div>

                {/* Right column */}
                <div className="mt-4 lg:mt-0 w-full">
                    <h1 className="text-4xl font-bold text-center text-blue-600/100 my-8">
                        Contact Us
                    </h1>
                    {successMessage && (
                        <p className="text-2xl bg-red-500 text-white text-center">
                            {successMessage}
                        </p>
                    )}
                    <form onSubmit={handleSubmit} className="bg-gray-100 p-6">
                        {/* Your form inputs go here */}

                        <input
                            className="w-full mb-4 p-2 rounded-md"
                            name="name"
                            type="text"
                            placeholder="Full Name"
                        />
                        <div className="flex flex-col lg:flex-row lg:gap-4">
                            <input
                                className="w-full lg:w-1/2 mb-4 p-2 rounded-md"
                                name="email"
                                type="email"
                                placeholder="Email"
                            />
                            <input
                                className="w-full lg:w-1/2 mb-4 p-2 rounded-md"
                                name="phone"
                                type="text"
                                placeholder="Phone Number"
                            />
                        </div>
                        <textarea
                            className="w-full mb-4 p-2 rounded-md"
                            rows="4"
                            name="inquiry"
                            placeholder="What is your inquiry about?"
                        ></textarea>
                        <button className="bg-blue-500 text-white py-2 px-4 w-full rounded-md hover:bg-blue-600">
                            Submit
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Contact;
