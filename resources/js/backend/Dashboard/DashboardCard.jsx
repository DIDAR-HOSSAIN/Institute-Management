import React from 'react';

const DashboardCard = ({ title, description, imageUrl }) => {
    return (
        <div className="bg-white rounded-lg overflow-hidden shadow-md p-4">
            <img
                src={imageUrl}
                alt={title}
                className="w-full h-32 object-cover mb-4"
            />
            <h2 className="text-xl font-bold mb-2">{title}</h2>
            <p className="text-gray-600">{description}</p>
        </div>
    );
};

export default DashboardCard;