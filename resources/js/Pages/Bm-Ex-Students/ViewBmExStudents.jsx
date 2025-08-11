import AdminDashboardLayout from "@/backend/Dashboard/AdminDashboardLayout";
import { Head, Link } from "@inertiajs/react";
import { CSVLink } from "react-csv";
import { useEffect, useState } from "react";
import { Inertia } from "@inertiajs/inertia";
import DateWiseReport from "./Reports/DateWiseReport";
import { hasAnyRole, hasRole } from "@/backend/Utils/RoleCheck";
import { FiEye, FiEdit, FiTrash2 } from "react-icons/fi";
import { FaFileInvoice, FaTrashAlt } from "react-icons/fa";
import Swal from "sweetalert2";

const ViewBmExStudents = ({ auth, members }) => {
    console.log("view bm", members);
    const [filteredData, setFilteredData] = useState(members);
    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    const handlePerPageChange = (e) => {
        const value = e.target.value;
        setPerPage(value === "all" ? members.length : parseInt(value));
        setCurrentPage(1);
    };

    const totalPages =
        perPage === "all" ? 1 : Math.ceil(members.length / perPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
    

    useEffect(() => {
        const startIndex = (currentPage - 1) * perPage;
        const endIndex = Math.min(startIndex + perPage, members.length);
        const displayedData = members.slice(startIndex, endIndex);
        setFilteredData(displayedData);
    }, [members, currentPage, perPage]);

    const formatDate = (date) => new Date(date).toLocaleDateString("en-GB");

    const handleDateWiseSearch = (startDate, endDate) => {
        if (!startDate || !endDate) {
            setFilteredData(members);
            return;
        }

        const filteredData = members.filter((data) => {
            const entryDate = new Date(data.entry_date);
            return (
                entryDate >= startDate &&
                entryDate <= new Date(endDate.getTime() + 86400000)
            );
        });

        setFilteredData(filteredData);
    };

    const handleSearch = (searchTerm) => {
        const filtered = members.filter((data) => {
            return (
                data.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                data.member_id
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                data.mobile_no.toLowerCase().includes(searchTerm.toLowerCase())
            );
        });

        setFilteredData(filtered);
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This action cannot be undone!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
        }).then((res) => {
            if (res.isConfirmed) {
                Inertia.delete(route("members.destroy", { id }), {
                    onSuccess: () => {
                        Swal.fire(
                            "Deleted!",
                            "The Student has been deleted.",
                            "success"
                        );
                        Inertia.reload();
                        // Option 1: Update local state
                        setRes((prevResults) =>
                            prevResults.filter((res) => res.id !== id)
                        );

                        // Option 2: Refetch the page
                        // Inertia.reload();
                    },
                    onError: (errors) => {
                        Swal.fire(
                            "Error!",
                            errors?.message ||
                                "Something went wrong. Please try again.",
                            "error"
                        );
                    },
                });
            }
        });
    };

    return (
        <AdminDashboardLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Manage Member
                </h2>
            }
        >
            <Head title="Manage Member" />

            <div className="py-2">
                <div className="mx-auto">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="flex items-center justify-between mb-6">
                                <Link
                                    className="px-6 py-2 text-white bg-green-500 rounded-md focus:outline-none"
                                    href={route("members.create")}
                                >
                                    Add Member
                                </Link>

                                <CSVLink
                                    data={filteredData}
                                    filename={"Member Report.csv"}
                                    className="px-6 py-2 text-white bg-green-500 rounded-md focus:outline-none"
                                >
                                    Export
                                </CSVLink>
                            </div>

                            <div className="flex items-center justify-between mb-6">
                                <DateWiseReport
                                    data={members}
                                    onSearch={handleDateWiseSearch}
                                    startDateField="entry_date"
                                    endDateField="entry_date"
                                />

                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        className="px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                                        onChange={(e) =>
                                            handleSearch(e.target.value)
                                        }
                                    />
                                    <span className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                        {/* Add a search icon or clear button if needed */}
                                    </span>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full whitespace-nowrap">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th className="px-4 py-2">No.</th>
                                            <th className="px-4 py-2">
                                                Member ID
                                            </th>
                                            <th className="px-4 py-2">Image</th>
                                            <th className="px-4 py-2">
                                                Reg Date
                                            </th>
                                            <th className="px-4 py-2">Name</th>
                                            <th className="px-4 py-2">
                                                Mobile No
                                            </th>
                                            <th className="px-4 py-2">
                                                Date of Birth
                                            </th>
                                            <th className="px-4 py-2">
                                                Status
                                            </th>
                                            <th className="px-4 py-2">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredData.map(
                                            (
                                                {
                                                    id,
                                                    member_id,
                                                    image,
                                                    reg_date,
                                                    name,
                                                    mobile_no,
                                                    date_of_birth,
                                                    status,
                                                },
                                                index
                                            ) => (
                                                <tr key={id}>
                                                    <td className="border px-4 py-2">
                                                        {index + 1}
                                                    </td>
                                                    <td className="border px-4 py-2">
                                                        {member_id}
                                                    </td>
                                                    <td className="border px-4 py-2">
                                                        <img
                                                            src={`/public/images/students/${image}`}
                                                            // src={`/images/students/${image}`}
                                                            alt="Product Image"
                                                            className="w-24 h-auto object-cover"
                                                        />
                                                    </td>
                                                    <td className="border px-4 py-2">
                                                        {formatDate(reg_date)}
                                                    </td>
                                                    <td className="border px-4 py-2">
                                                        {name}
                                                    </td>
                                                    <td className="border px-4 py-2">
                                                        {mobile_no}
                                                    </td>
                                                    <td className="border px-4 py-2">
                                                        {formatDate(
                                                            date_of_birth
                                                        )}
                                                    </td>
                                                    <td className="border px-4 py-2">
                                                        {status}
                                                    </td>

                                                    <td className="border px-4 py-2 text-center">
                                                        {/* View Details Button */}
                                                        <Link
                                                            tabIndex="1"
                                                            className="mr-1 p-2 text-white bg-blue-900 rounded inline-flex items-center"
                                                            href={route(
                                                                "members.show",
                                                                id
                                                            )}
                                                            title="View Details"
                                                        >
                                                            <FiEye className="h-5 w-5" />
                                                        </Link>

                                                        {/* Money Receipt Button */}
                                                        {/* <Link
                                                            tabIndex="1"
                                                            className="p-2 text-white bg-green-700 rounded inline-flex items-center"
                                                            href={route(
                                                                "member-inv",
                                                                member_id
                                                            )}
                                                            title="Money Receipt"
                                                        >
                                                            <FaFileInvoice className="h-5 w-5" />
                                                        </Link> */}

                                                        {/* Edit Button */}
                                                        {hasAnyRole(auth.user, [
                                                            "super-admin",
                                                            "admin",
                                                        ]) && (
                                                            <Link
                                                                tabIndex="1"
                                                                className="mx-1 p-2 text-white bg-blue-500 rounded inline-flex items-center"
                                                                href={route(
                                                                    "members.edit",
                                                                    id
                                                                )}
                                                                title="Edit Record"
                                                            >
                                                                <FiEdit className="h-5 w-5" />
                                                            </Link>
                                                        )}

                                                        {hasRole(
                                                            auth.user,
                                                            "super-admin"
                                                        ) && (
                                                            <button
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        id
                                                                    )
                                                                }
                                                                className="p-2 text-white bg-red-500 rounded"
                                                                title="Delete"
                                                            >
                                                                <FaTrashAlt className="h-5 w-5" />
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            )
                                        )}

                                        {filteredData.length === 0 && (
                                            <tr>
                                                <td
                                                    className="px-6 py-4 border-t"
                                                    colSpan="6"
                                                >
                                                    No Patient found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>

                                {/* Pagination select controls */}
                                <div className="flex items-center justify-evenly mt-6">
                                    <select
                                        value={perPage}
                                        onChange={handlePerPageChange}
                                        className="px- py-2 border rounded-md"
                                    >
                                        <option value={10}>10</option>
                                        <option value={20}>20</option>
                                        <option value={30}>30</option>
                                        <option value={50}>50</option>
                                        <option value={100}>100</option>
                                        <option value="all">All</option>
                                    </select>

                                    {/* Pagination buttons */}
                                    <div className="flex">
                                        {Array.from(
                                            { length: totalPages },
                                            (_, index) => (
                                                <button
                                                    key={index}
                                                    className={`px-3 py-1 border ${
                                                        currentPage ===
                                                        index + 1
                                                            ? "bg-blue-500 text-white"
                                                            : ""
                                                    }`}
                                                    onClick={() =>
                                                        handlePageChange(
                                                            index + 1
                                                        )
                                                    }
                                                >
                                                    {index + 1}
                                                </button>
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminDashboardLayout>
    );
};

export default ViewBmExStudents;
