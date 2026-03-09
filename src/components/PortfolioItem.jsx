import React from 'react';

const PortfolioItem = ({ title, image }) => {
    return (
        <div className="relative overflow-hidden rounded-2xl cursor-pointer group shadow-md hover:shadow-xl transition-shadow">
            <img
                src={image}
                alt={title}
                className="w-full h-52 object-cover transition-transform duration-500 group-hover:scale-110"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-white font-bold text-lg tracking-wide drop-shadow">
                    {title}
                </span>
            </div>
        </div>
    );
};

export default PortfolioItem;
