import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import { Link } from "@inertiajs/react";
import logo from "@/assets/images/Logo/bashiria-madrasah-prakton-logo.png";
import { FaPhone  } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";

const Footer = () => {
    const redirectToExternalLink = (url) => {
        window.open(url, "_blank");
    };

    return (
        <footer className="bg-[#263859] text-white mt-2">
            <div className="container mx-auto text-center">
                {/* Logo */}
                <div className="mb-2">
                    <img className="h-24 mx-auto" src={logo} alt="JT Logo" />
                </div>
                {/* Navigation Links */}
                <div className="flex flex-wrap justify-center mb-2 space-x-4">
                    <Link href="/about-us" className="hover:underline">
                        About Us
                    </Link>
                    <Link href="/blog" className="hover:underline">
                        Blog
                    </Link>
                    <Link href="/jobs" className="hover:underline">
                        Jobs
                    </Link>
                    <Link href="/press" className="hover:underline">
                        Press
                    </Link>
                    <Link href="/accessibility" className="hover:underline">
                        Accessibility
                    </Link>
                    <Link href="/partners" className="hover:underline">
                        Partners
                    </Link>
                </div>

                {/* Contact Information */}
                <div className="flex justify-center space-x-4">
                    <div className="flex items-center space-x-2">
                        <FaPhone
                            className="w-6 h-6 text-white"
                            style={{ transform: "rotate(90deg)" }}
                        />
                        <span className="text-md font-semibold">
                            +8801779479700
                        </span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <MdOutlineEmail 
                            className="w-6 h-6 text-white"
                        />
                        <span className="text-md font-semibold">
                        bashiriamadrasah@gmail.com
                        </span>
                    </div>
                </div>

                {/* Social Media Links */}
                <div className="flex justify-center mb-2 space-x-6">
                    <FaFacebook
                        className="text-3xl cursor-pointer hover:text-blue-300"
                        onClick={() =>
                            redirectToExternalLink(
                                "https://www.facebook.com/"
                            )
                        }
                    />
                    <FaTwitter
                        className="text-3xl cursor-pointer hover:text-blue-300"
                        onClick={() =>
                            redirectToExternalLink("https://www.twitter.com")
                        }
                    />
                    <FaInstagram
                        className="text-3xl cursor-pointer hover:text-blue-300"
                        onClick={() =>
                            redirectToExternalLink("https://www.instagram.com")
                        }
                    />
                    <FaLinkedin
                        className="text-3xl cursor-pointer hover:text-blue-300"
                        onClick={() =>
                            redirectToExternalLink("https://www.linkedin.com")
                        }
                    />
                </div>
                {/* Footer Text */}
                <div className="text-sm">
                    <p>Developed by: JT | ©2024 JT. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
