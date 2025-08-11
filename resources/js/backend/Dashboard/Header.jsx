import UserDropdown from "@/SharedComponents/UserDropdown";

const Header = ({user, isOpen, toggleSidebar }) => {
    // In Header component
console.log("User object in Header:", user);

    const handleSidebarToggle = () => {
        toggleSidebar(); // Toggle sidebar
    };


    return (
        <div className="bg-gray-300 w-full">
            <nav className="p-4 flex justify-between items-center">
                {/* Always display toggle button */}
                <div>
                    <button
                        onClick={handleSidebarToggle}
                        className="p-2 focus:outline-none"
                    >
                        <svg
                            className="h-6 w-6 fill-current"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                        >
                            {isOpen ? (
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M6 7.41l1.41-1.41L12 10.17l4.59-4.58L18 7.41 13.41 12 18 16.59 16.59 18 12 13.41 7.41 18 6 16.59 10.17 12 6 7.41z"
                                />
                            ) : (
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm16 4H4v2h16v-2z"
                                />
                            )}
                        </svg>
                    </button>
                </div>
                {/* ... Other header content */}
                <div>
                    <h1>Dashboard</h1>
                </div>
                <div className="flex items-center">
                    {/* Hamburger icon for mobile */}

                    {/* header user dropdown */}
                    <div className="mr-4">
                        <UserDropdown user={user} />
                    </div>
                    <div>{user?.name}</div>
                </div>
            </nav>
        </div>
    );
};

export default Header;



