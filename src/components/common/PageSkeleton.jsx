import React from 'react';

const PageSkeleton = () => (
    <div
        className="min-h-[60vh] bg-bg-soft px-6 pb-20 pt-32"
        role="status"
        aria-live="polite"
        aria-label="Chargement de la page"
    >
        <div className="container space-y-6">
            <div className="h-8 w-2/3 max-w-md skeleton" />
            <div className="h-4 w-1/2 max-w-sm skeleton" />
            <div className="grid gap-5 pt-6 md:grid-cols-3">
                {[1, 2, 3].map((item) => (
                    <div key={item} className="h-44 rounded-2xl skeleton" />
                ))}
            </div>
        </div>
    </div>
);

export default PageSkeleton;
