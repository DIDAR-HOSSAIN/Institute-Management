import React from 'react';

const Breadcrumbs = ( {header} ) => {
    return (
        <div className="navbar bg-base-100">
        <div className="flex-1">
            {header && (
                    <div className="">{header}</div>
            )}
        </div>
        <div className="flex-none">
            <div className="text-sm breadcrumbs">
        <ul>
            <li><a>Home</a></li> 
            <li><a>Documents</a></li> 
            <li>Add Document</li>
        </ul>
        </div>
        </div>
        </div>
        
    );
};

export default Breadcrumbs;