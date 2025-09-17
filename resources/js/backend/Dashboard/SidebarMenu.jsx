import React, { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import { hasAnyRole, hasRole } from "../Utils/RoleCheck";

const SidebarMenu = () => {
    const { auth } = usePage().props;

    const [dropdownState, setDropdownState] = useState({
        studentDropdown: false,
        feeCollectionDropdown: false,
        resultDropdown: false,
        categoryDropdown: false,
        payrollDropdown: false,
        settings: false,
    });

    const toggleDropdown = (dropdown) => {
        setDropdownState((prevState) => ({
            ...prevState,
            [dropdown]: !prevState[dropdown],
        }));
    };

    return (
        <div>
            <div className="flex">
                <button
                    onClick={() => toggleDropdown("studentDropdown")}
                    className="bg-blue-400 hover:bg-white font-bold btn w-full text-lg rounded"
                >
                    {dropdownState.studentDropdown
                        ? "Admission ▲"
                        : "Admission ▼"}
                </button>
            </div>
            {dropdownState.studentDropdown && (
                <div className="flex flex-col gap-1">
                    {hasAnyRole(auth.user, [
                        "super-admin",
                        "admin",
                        "sub-admin",
                        "user",
                    ]) && (
                            <Link
                                href="/students/create"
                                className="hover:bg-yellow-200 font-bold btn btn-blue rounded"
                            >
                                Add New Student
                            </Link>
                        )}

                    {hasAnyRole(auth.user, [
                        "super-admin",
                        "admin",
                        "sub-admin",
                        "user",
                        "general",
                    ]) && (
                            <Link
                                href="/students"
                                className="hover:bg-yellow-200 font-bold btn btn-blue rounded"
                            >
                                Manage Students
                            </Link>
                        )}
                </div>
            )}

            <div className="flex">
                <button
                    onClick={() => toggleDropdown("feeCollectionDropdown")}
                    className="bg-blue-400 hover:bg-white font-bold btn w-full text-lg rounded"
                >
                    {dropdownState.feeCollectionDropdown
                        ? "Fee Collection ▲"
                        : "Fee Collection ▼"}
                </button>
            </div>
            {dropdownState.feeCollectionDropdown && (
                <div className="flex flex-col gap-1">
                    {hasAnyRole(auth.user, [
                        "super-admin",
                        "admin",
                        "sub-admin",
                        "user",
                    ]) && (
                            <Link
                                href="/student-fees/create"
                                className="hover:bg-yellow-200 font-bold btn btn-blue rounded"
                            >
                                Fee Collection
                            </Link>
                        )}

                    {hasAnyRole(auth.user, [
                        "super-admin",
                        "admin",
                        "sub-admin",
                        "user",
                        "general",
                    ]) && (
                            <Link
                                href="/student-fees"
                                className="hover:bg-yellow-200 font-bold btn btn-blue rounded"
                            >
                                Manage Collection
                            </Link>
                        )}
                </div>
            )}


            <div className="flex">
                <button
                    onClick={() => toggleDropdown("resultDropdown")}
                    className="bg-blue-400 hover:bg-white font-bold btn w-full text-lg rounded"
                >
                    {dropdownState.resultDropdown
                        ? "Result Generate ▲"
                        : "Result Generate ▼"}
                </button>
            </div>
            {dropdownState.resultDropdown && (
                <div className="flex flex-col gap-1">
                    {hasAnyRole(auth.user, [
                        "super-admin",
                        "admin",
                        "sub-admin",
                        "user",
                    ]) && (
                            <Link
                                href="/student/results/create"
                                className="hover:bg-yellow-200 font-bold btn btn-blue rounded"
                            >
                                Result Generate (Single Student)
                            </Link>
                        )}

                    {hasAnyRole(auth.user, [
                        "super-admin",
                        "admin",
                        "sub-admin",
                        "user",
                        "general",
                    ]) && (
                            <Link
                                href="/results/create"
                                className="hover:bg-yellow-200 font-bold btn btn-blue rounded"
                            >
                                Result Generate (Exam wise)
                            </Link>
                        )}

                    {hasAnyRole(auth.user, [
                        "super-admin",
                        "admin",
                        "sub-admin",
                        "user",
                        "general",
                    ]) && (
                            <Link
                                href="/results"
                                className="hover:bg-yellow-200 font-bold btn btn-blue rounded"
                            >
                                Manage Results
                            </Link>
                        )}

                </div>
            )}


            <div className="flex">
                <button
                    onClick={() => toggleDropdown("sliderDropdown")}
                    className="bg-blue-400 hover:bg-white font-bold btn w-full text-lg rounded"
                >
                    {dropdownState.sliderDropdown ? "Slider ▲" : "Slider ▼"}
                </button>
            </div>
            {dropdownState.sliderDropdown && (
                <div className="flex flex-col gap-1">
                    {hasAnyRole(auth.user, ["super-admin", "admin"]) && (
                        <Link
                            href="/sliders/create"
                            className="hover:bg-yellow-200 font-bold btn btn-blue rounded"
                        >
                            Add Slider
                        </Link>
                    )}

                    {hasAnyRole(auth.user, ["super-admin", "admin"]) && (
                        <Link
                            href="/sliders"
                            className="hover:bg-yellow-200 font-bold btn btn-blue rounded"
                        >
                            Manage Slider
                        </Link>
                    )}
                </div>
            )}

            <div className="flex">
                <button
                    onClick={() => toggleDropdown("categoryDropdown")}
                    className="bg-blue-400 hover:bg-white font-bold btn w-full text-lg rounded"
                >
                    {dropdownState.categoryDropdown
                        ? "Categories ▲"
                        : "Categories ▼"}
                </button>
            </div>
            {dropdownState.categoryDropdown && (
                <div className="flex flex-col gap-1">
                    <Link
                        href="/categories/create"
                        className="hover:bg-yellow-200 font-bold btn btn-blue rounded"
                    >
                        Add Category
                    </Link>
                    <Link
                        href="/categories"
                        className="hover:bg-yellow-200 font-bold btn btn-blue rounded"
                    >
                        Manage Category
                    </Link>
                </div>
            )}

            <div className="flex">
                <button
                    onClick={() => toggleDropdown("payrollDropdown")}
                    className="bg-blue-400 hover:bg-white font-bold btn w-full text-lg rounded"
                >
                    {dropdownState.payrollDropdown
                        ? "Payroll ▲"
                        : "Payroll ▼"}
                </button>
            </div>
            {dropdownState.payrollDropdown && (
                <div className="flex flex-col gap-1">
                    <Link
                        href="/attendance/sync/create"
                        className="hover:bg-yellow-200 font-bold btn btn-blue rounded"
                    >
                        Add Payroll
                    </Link>
                    <Link
                        href="/attendance"
                        className="hover:bg-yellow-200 font-bold btn btn-blue rounded"
                    >
                        Manage Payroll
                    </Link>
                </div>
            )}

            <div className="flex">
                <button
                    onClick={() => toggleDropdown("settings")}
                    className="bg-blue-400 hover:bg-white font-bold btn w-full text-lg rounded"
                >
                    {dropdownState.settings ? "Settings ▲" : "Settings ▼"}
                </button>
            </div>
            {dropdownState.settings && (
                <div className="flex flex-col">
                    {hasAnyRole(auth.user, ["super-admin", "admin"]) && (
                        <Link
                            className="hover:bg-yellow-200 font-bold btn btn-blue rounded"
                            href="/users"
                        >
                            Manage User
                        </Link>
                    )}
                </div>
            )}
            {dropdownState.settings && (
                <div className="flex flex-col">
                    {hasRole(auth.user, "super-admin") && (
                        <Link
                            className="hover:bg-yellow-200 font-bold btn btn-blue rounded"
                            href="/roles"
                        >
                            Manage roles
                        </Link>
                    )}
                </div>
            )}

            {dropdownState.settings && (
                <div className="flex flex-col">
                    {hasRole(auth.user, "super-admin") && (
                        <Link
                            className="hover:bg-yellow-200 font-bold btn btn-blue rounded"
                            href="/permissions"
                        >
                            Manage Permissions
                        </Link>
                    )}
                </div>
            )}

            {dropdownState.settings && (
                <div className="flex flex-col">
                    {hasRole(auth.user, "super-admin") && (
                        <Link
                            className="hover:bg-yellow-200 font-bold btn btn-blue rounded"
                            href="/classes/create"
                        >
                            Add Class & Section Assign
                        </Link>
                    )}
                </div>
            )}

            {dropdownState.settings && (
                <div className="flex flex-col">
                    {hasRole(auth.user, "super-admin") && (
                        <Link
                            className="hover:bg-yellow-200 font-bold btn btn-blue rounded"
                            href="/class-subject"
                        >
                            Add Subject & Class Assign
                        </Link>
                    )}
                </div>
            )}

            {dropdownState.settings && (
                <div className="flex flex-col">
                    {hasRole(auth.user, "super-admin") && (
                        <Link
                            className="hover:bg-yellow-200 font-bold btn btn-blue rounded"
                            href="/class-fees"
                        >
                            Add Class Fee Assign
                        </Link>
                    )}
                </div>
            )}

        </div>
    );
};

export default SidebarMenu;
