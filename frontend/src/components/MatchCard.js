import React from 'react';

const MatchCard = ({ clubId, match, title }) => {
    return (
        <div className="border rounded-lg shadow-md overflow-hidden">
            <div className="bg-gray-200 p-2 text-center font-semibold">
                {title}
            </div>
            {match ? (
                <>
                    <div className="bg-white p-2 text-center font-semibold">
                        {match.date} - {match.time}
                    </div>
                    <div className="p-4">
                        <div className="flex justify-center items-center">
                            <div className="flex-1 text-center">
                                {match.homeTeam.logoUrl && (
                                    <img
                                        src={match.homeTeam.logoUrl}
                                        className="h-10 mx-auto"
                                        alt={`Logo ${match.homeTeam.name}`}
                                    />
                                )}
                                <p className={`text-sm mt-2 ${match.homeTeam.clubId === clubId ? 'font-bold text-primary' : ''}`}>
                                    {match.homeTeam.name}
                                </p>
                            </div>
                            <div className="flex-1 text-center">
                                {match.awayScore !== null ? (
                                    <div className="text-4xl font-bold">
                                        <p>{match.homeScore} - {match.awayScore}</p>
                                    </div>
                                ) : (
                                    <p className="text-4xl font-bold text-primary">VS</p>
                                )}
                                {match.awayPenaltiesScore !== null && (
                                    <div className="mt-2">
                                        <p className="text-sm">Tirs au but</p>
                                        <p className="text-base font-semibold">{match.homePenaltiesScore} - {match.awayPenaltiesScore}</p>
                                    </div>
                                )}
                                {match.forfeit ? (
                                    <div className="mt-2">
                                        <p className="text-sm">Forfait</p>
                                    </div>
                                ) : null}
                            </div>
                            <div className="flex-1 text-center">
                                {match.awayTeam.logoUrl && (
                                    <img
                                        src={match.awayTeam.logoUrl}
                                        className="h-10 mx-auto"
                                        alt={`Logo ${match.awayTeam.name}`}
                                    />
                                )}
                                <p className={`text-sm mt-2 ${match.awayTeam.clubId === clubId ? 'font-bold text-primary' : ''}`}>
                                    {match.awayTeam.name}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-primary text-text p-2 text-center">
                        {match.competitionName} - {match.competitionType === 'CP' ? 'Tour' : 'Journée'} {match.groupDay}
                    </div>
                </>
            ) : (
                <div className="p-4 text-center text-lg font-semibold">
                    Pas de match
                </div>
            )}
        </div>
    );
};

export default MatchCard;
