import React from 'react';

const ServiceCard = ({ title, description, icon }) => {
    return (
        <div className="flex-1 min-w-[280px] bg-gray-50 border border-gray-100 rounded-2xl p-8 text-center shadow-sm hover:shadow-md hover:border-blue-200 transition-all group cursor-pointer">
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform text-blue-600">
                {icon}
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">{title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
        </div>
    );
};

export default ServiceCard;
