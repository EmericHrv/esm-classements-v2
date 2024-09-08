import React from 'react';

const Header = ({ title }) => {
    return (
        <div className="flex items-center justify-center h-16 bg-primary">
            <h1 className="text-2xl font-semibold leading-6 text-text">{title}</h1>
        </div>
    );
};

export default Header;
