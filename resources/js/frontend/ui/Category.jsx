import React from "react";

const Category = ({ categories, onCategoryClick, selectedCategory }) => {
    const getCategoryImage = (categoryName) => {
        const categoryImages = {
            Kurties: "/images/category-images/kurti-4.jpg",
            "Two Pieces": "/images/category-images/two-pieces2.jpg",
            "Stitch Three pieces": "/images/category-images/stitch-three-pieces1.jpg",
            "Boutiques Three pieces": "/images/category-images/boutiques-three-pieces.jpg",
            "Exclusive Boutiques three pieces": "/images/category-images/exclusive-boutiques.jpg",
            Orna: "/images/category-images/orna-1.jpeg",
            Salwar: "/images/category-images/salwar1.jpg",
        };
        return categoryImages[categoryName] || "/images/categories/default.jpg";
    };

    return (
        <>
            <h1 className="text-center text-2xl font-bold p-0">Featured Category</h1>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 my-4 gap-4 p-0 m-0">
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => onCategoryClick(category)}
                        aria-pressed={selectedCategory === category}
                        className={`flex flex-col items-center rounded-lg shadow-lg transition-transform transform hover:scale-105 duration-300 ease-in-out m-0 p-0 ${
                            selectedCategory === category ? "bg-blue-700 text-white" : "bg-white hover:bg-gray-50"
                        }`}
                        style={{ margin: 0, padding: 0 }}
                    >
                        {/* Square Category Image */}
                        <div
                            className="w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-12 lg:h-16 overflow-hidden shadow-sm"
                            style={{ margin: 0, padding: 0 }}
                        >
                            <img
                                src={getCategoryImage(category)}
                                alt={category}
                                className="w-full h-full object-cover"
                                style={{ margin: 0, padding: 0 }}
                            />
                        </div>
                        {/* Category Name */}
                        <span
                            className={`text-sm md:text-base font-semibold text-center ${
                                selectedCategory === category ? "text-white" : "text-gray-800"
                            }`}
                            style={{ margin: 0, padding: 0 }}
                        >
                            {category}
                        </span>
                    </button>
                ))}
            </div>
        </>
    );
};

export default Category;
