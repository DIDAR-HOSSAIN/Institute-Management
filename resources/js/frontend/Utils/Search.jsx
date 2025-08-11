import React from "react";
import { FaSearch } from "react-icons/fa";

const Search = ({ searchQuery, onSearch }) => {
    const handleChange = (e) => {
        const query = e.target.value;
        onSearch(query); // Call the search handler with the new query
    };

    return (
        <div className="relative w-full max-w-md mx-auto lg:mx-0">
            <input
                type="text"
                value={searchQuery}
                onChange={handleChange}
                placeholder="Search products..."
                className="pl-10 pr-4 py-2 w-full rounded-md text-black focus:outline-none"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-500" />
        </div>
    );
};

export default Search;
