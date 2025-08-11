import AdminDashboardLayout from "@/backend/Dashboard/AdminDashboardLayout";
import { Head } from "@inertiajs/react";
import money_receipt_header_img from "@/assets/images/Money-Receipt/money_receipt_Header.png";
import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import numberToWords from "number-to-words";
import Barcode from "react-barcode";

const MoneyReceipt = ({ auth, data }) => {
    console.log("from money receipt", data);
    console.log("from money auth", auth);

    const formatDate = (dateString) => {
        const options = { day: "numeric", month: "short", year: "numeric" };
        return new Date(dateString).toLocaleDateString("en-GB", options);
    };

    // Destructure relevant data
    const {
        patient_id,
        name,
        contact_no,
        passport_no,
        age,
        sex,
        address,
        district,
        police_station,
        test_name,
        entry_date,
        test_fee,
        reg_fee,
        online_fee,
        discount,
        paid,
        due,
        total,
    } = data;

    const contentToPrint = useRef(null);
    const handlePrint = useReactToPrint({
        documentTitle: `${patient_id || "N/A"}`,
        onBeforePrint: () => console.log("before printing..."),
        onAfterPrint: () => console.log("after printing..."),
        removeAfterPrint: true,
        content: () => contentToPrint.current,
        pageStyle: `
                @page {
                    size: B4;
                    margin: 0;
                }
            `,
    });

    // Function to convert number to inwords
    const convertToWords = (amount) => {
        return numberToWords.toWords(amount);
    };

    return (
        <AdminDashboardLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Dope Money Receipt
                </h2>
            }
        >
            <Head title="Dope Money Receipt" />

            <button
                onClick={() => {
                    handlePrint(null, () => contentToPrint.current);
                }}
                className="mx-auto mt-2 block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
                Print
            </button>

            <div
                ref={contentToPrint}
                className="money-receipt bg-white rounded-lg mt-2 p-6 max-w-2xl mx-auto"
            >
                <img
                    className="w-full h-full object-contain"
                    src={money_receipt_header_img}
                    alt=""
                />
                <p className="text-center">
                    953 O.R Nizam Road, Chattogram - 4000, Contact :
                    01883077569, Email : mchctg.rtpcrlab@gmail.com
                </p>

                <h2 className="text-xl text-center font-semibold my-4">
                    Money Receipt (Dope)
                </h2>

                {/* Barcode Section */}
                <div className="text-center mb-4">
                    <Barcode
                        value={patient_id || "N/A"}
                        width={1} // Set the desired width (in pixels)
                        height={50} // Set the desired height (in pixels)
                    />
                </div>

                {/* Personal Information Section */}
                <div className="grid grid-cols-2 items-center">
                    <div>
                        <div className="info-row">
                            <span className="info-label font-bold mr-1">
                                Reg Id :
                            </span>
                            <span className="info-value">
                                {patient_id || "N/A"}
                            </span>
                        </div>
                        <div className="info-row">
                            <span className="info-label font-bold mr-1">
                                Name :
                            </span>
                            <span className="info-value">{name || "N/A"}</span>
                        </div>
                        <div className="info-row">
                            <span className="info-label font-bold mr-1">
                                Mobile no :
                            </span>
                            <span className="info-value">
                                {contact_no || "N/A"}
                            </span>
                        </div>
                        <div className="info-row">
                            <span className="info-label font-bold mr-1">
                                Address :
                            </span>
                            <span className="info-value">
                                {address || "N/A"}, {police_station || "N/A"}, {district || "N/A"}.
                            </span>
                        </div>
                    </div>

                    <div>
                        <div className="info-row">
                            <span className="info-label font-bold mr-1">
                                Passport no :
                            </span>
                            <span className="info-value">
                                {passport_no || "N/A"}
                            </span>
                        </div>
                        <div className="info-row">
                            <span className="info-label font-bold mr-1">
                                Age :
                            </span>
                            <span className="info-value">{age || "N/A"}</span>
                        </div>
                        <div className="info-row">
                            <span className="info-label font-bold mr-1">
                                Sex :
                            </span>
                            <span className="info-value">{sex || "N/A"}</span>
                        </div>
                        <div className="info-row">
                            <span className="info-label font-bold mr-1">
                                Date :
                            </span>
                            <span className="info-value">
                                {formatDate(entry_date || "N/A")}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Billing Information Section */}
                <div className="section billing-info mb-6 mt-2">
                    <table className="info-table w-full border-collapse border">
                        <thead>
                            <tr className="border-b">
                                <th className="p-3">S/N</th>
                                <th className="p-3">Test Name</th>
                                <th className="p-3">Date</th>
                                <th className="p-3 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Existing row */}
                            <tr className="border-b">
                                <td className="p-3">1</td>
                                <td className="p-3 text-center">{test_name}</td>
                                <td className="p-3 text-center">
                                    {formatDate(entry_date)}
                                </td>
                                <td className="p-3 text-right">{test_fee}.00</td>
                            </tr>

                            <tr className="border-b">
                                <td className="p-3">2</td>
                                <td className="p-3 text-center">Reg Fee</td>
                                <td className="p-3 text-center">
                                    
                                </td>
                                <td className="p-3 text-right">{reg_fee}.00</td>
                            </tr>

                            <tr className="border-b">
                                <td className="p-3">3</td>
                                <td className="p-3 text-center">Online Fee</td>
                                <td className="p-3 text-center">
                                    
                                </td>
                                <td className="p-3 text-right">{online_fee}.00</td>
                            </tr>

                            {/* Additional rows (replace 'placeholder' with actual data) */}
                            <tr className="border-b">
                                <td className="p-3"></td>
                                <td className="p-3 text-center"></td>
                                <td className="p-3 text-right">Subtotal :</td>
                                <td className="p-3 text-right">{parseFloat(test_fee) + parseFloat(reg_fee) + parseFloat(online_fee)}.00</td>
                            </tr>
                            <tr className="border-b">
                                <td className="p-3"></td>
                                <td className="p-3 text-center"></td>
                                <td className="p-3 text-right">Discount :</td>
                                <td className="p-3 text-right">
                                    {discount || 0}.00
                                </td>
                            </tr>
                            <tr className="border-b">
                                <td className="p-3"></td>
                                <td className="p-3 text-center"></td>
                                <td className="p-3 text-right">
                                    Net Payable :
                                </td>
                                <td className="p-3 text-right">
                                    {total || 0}.00
                                </td>
                            </tr>
                            <tr className="border-b">
                                <td className="p-3"></td>
                                <td className="p-3 text-center"></td>
                                <td className="p-3 text-right">Paid :</td>
                                <td className="p-3 text-right">
                                    {paid || 0}.00
                                </td>
                            </tr>
                            <tr className="border-b">
                                <td className="p-3"></td>
                                <td className="p-3 text-center"></td>
                                <td className="p-3 text-right bg-black text-white text-xl">Due :</td>
                                <td className="p-3 text-right font-extrabold">
                                    {due || 0}.00
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <p>
                        In Word: {convertToWords(paid || 0)} Tk. Receive from {name}
                    </p>
                    <h3>Prepared By : {auth.user.name}</h3>
                </div>
            </div>
        </AdminDashboardLayout>
    );
};

export default MoneyReceipt;
