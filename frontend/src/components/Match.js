import React from 'react';

const Match = ({ clubId, match }) => {
    return (
        <div className="overflow-hidden">
            <div className="p-2">
                <div className="text-center text-xs mt-2 text-gray-600">
                    {match.date} à {match.time}
                </div>
                <div className="flex justify-between items-center">
                    <div className="flex-1 text-center">
                        {match.homeTeam.logoUrl && (
                            <img
                                src={match.homeTeam.logoUrl}
                                className="h-8 mx-auto"
                                alt={`Logo ${match.homeTeam.name}`}
                            />
                        )}
                        <p className={`text-xs mt-1 ${match.homeTeam.clubId === clubId ? 'font-bold text-primary' : ''}`}>
                            {match.homeTeam.name}
                        </p>
                    </div>
                    <div className="flex-1 text-center">
                        <div className="text-4xl font-bold">
                            <p>{match.homeScore} - {match.awayScore}</p>
                        </div>
                        {match.forfeit ? (
                            <div className="mt-2">
                                <p className="text-xs">Forfait</p>
                            </div>
                        ) : null}
                    </div>
                    <div className="flex-1 text-center">
                        {match.awayTeam.logoUrl && (
                            <img
                                src={match.awayTeam.logoUrl}
                                className="h-8 mx-auto"
                                alt={`Logo ${match.awayTeam.name}`}
                            />
                        )}
                        <p className={`text-xs mt-1 ${match.awayTeam.clubId === clubId ? 'font-bold text-primary' : ''}`}>
                            {match.awayTeam.name}
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Match;
