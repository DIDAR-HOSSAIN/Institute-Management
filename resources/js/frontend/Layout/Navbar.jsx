import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import { Link } from "@inertiajs/react";
import logo from "@/assets/images/Logo/bashiria-madrasah-prakton-logo.png";
import UserDropdown from "@/SharedComponents/UserDropdown";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import { FaPhone } from "react-icons/fa";

const Navbar = ({ user, menus }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const isLargeScreen = useMediaQuery({ minWidth: 1024 });

    return (
        <nav className="bg-[#263859] font-bold z-20 sticky top-0 shadow-md">
            <div className="container mx-auto flex items-center justify-between py-2 px-4 lg:px-6">
                {/* Mobile View */}
                <div className="flex items-center justify-between w-full lg:hidden">
                    {/* Left: Menu Icon */}
                    <button
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="text-white"
                        aria-label="Open menu"
                    >
                        <Bars3Icon className="w-7 h-7" />
                    </button>

                    {/* Center: Logo */}
                    <Link href="/" className="flex justify-center">
                        <img src={logo} alt="Logo" className="h-10" />
                    </Link>

                    {/* Right: User Icon */}
                    <UserDropdown user={user} />
                </div>

                {/* Large Screen View */}
                <div className="hidden lg:flex items-center justify-between w-full">
                    {/* Left: Logo */}
                    <Link href="/" className="flex items-center">
                        <img src={logo} alt="Logo" className="h-12" />
                    </Link>

                    {/* Center: Menu */}
                    <div className="flex-1 flex justify-center space-x-6">
                        {menus?.map((menu) => (
                            <Link
                                key={menu.id}
                                href={menu.path}
                                className="text-white text-base hover:text-gray-300 transition"
                            >
                                {menu.category}
                            </Link>
                        ))}
                    </div>

                    {/* Right: Contact and User */}
                    <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-2 text-white">
                            <FaPhone className="w-5 h-5 rotate-90" />
                            <div className="text-sm leading-4">
                                <p>Call Us Now</p>
                                <span className="text-base font-semibold">
                                    +8801779479700
                                </span>
                            </div>
                        </div>
                        <UserDropdown user={user} />
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-40 z-40"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Mobile Menu Drawer */}
            <div
                className={`fixed top-0 left-0 w-64 h-full bg-[#263859] shadow-lg z-50 transform transition-transform duration-300 ${
                    isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <div className="flex justify-end p-4">
                    <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-white"
                        aria-label="Close menu"
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>

                <ul className="p-6 space-y-4">
                    {menus?.map((menu) => (
                        <li key={menu.id}>
                            <Link
                                href={menu.path}
                                className="block text-white text-lg hover:bg-blue-700 px-4 py-2 rounded-md transition"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {menu.category}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
