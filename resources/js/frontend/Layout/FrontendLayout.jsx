// resources/js/frontend/Layout/FrontendLayout.jsx
import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { usePage } from "@inertiajs/react";

const FrontendLayout = ({ children }) => {
    const { menus, auth } = usePage().props;

    return (
        <>
            <Navbar user={auth?.user} menus={menus} />
            {children}
            <Footer />
        </>
    );
};

export default FrontendLayout;
