import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import "./../../../css/AdminDashboardLayout.css"; // Import your CSS file
import Breadcrumbs from "@/SharedComponents/Breadcrumbs";

const AdminDashboardLayout = ({user, header, children }) => {
    console.log("User object in Layout:", user);
    // Set initial state based on screen size
    const isSidebarInitiallyOpen = window.innerWidth >= 768; // Adjust the breakpoint as needed
    const [isSidebarOpen, setIsSidebarOpen] = useState(isSidebarInitiallyOpen);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div
            className={`flex h-screen bg-gray-100 ${
                isSidebarOpen ? "" : "sidebar-collapsed"
            }`}
        >
            {/* Sidebar */}
            {isSidebarOpen && <Sidebar />}

            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header with toggle button */}
                <Header user={user} isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

                {/* Main content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
                    <div className="container mx-auto p-4">
                        {/* Content passed as children */}
                        <Breadcrumbs header={header} />
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminDashboardLayout;
