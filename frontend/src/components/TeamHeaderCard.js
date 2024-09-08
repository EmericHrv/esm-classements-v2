import React from 'react';

const TeamHeaderCard = ({ title, competitionName, poule }) => {
    return (
        <div className="bg-primary text-text p-4 rounded-lg shadow-md text-center">
            <h2 className="text-lg font-bold">{title}</h2>
            <p className="text-sm font-semibold">{competitionName} - {poule}</p>
        </div>
    );
};

export default TeamHeaderCard;
