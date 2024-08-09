import React from 'react';

const RankingTable = ({ ranking, clubId }) => {
    return (
        <div className="overflow-y-auto max-h-80 rounded-lg">
            <table className="w-full text-left border-collapse text-xs rounded-lg overflow-hidden">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="p-1 text-center">Pl</th>
                        <th className="p-1">Équipe</th>
                        <th className="p-1 text-right">Pts</th>
                        <th className="p-1 text-right">J</th>
                        <th className="p-1 text-right">G</th>
                        <th className="p-1 text-right">N</th>
                        <th className="p-1 text-right">P</th>
                        <th className="p-1 text-right">BP</th>
                        <th className="p-1 text-right">BC</th>
                        <th className="p-1 text-right">Diff</th>
                    </tr>
                </thead>
                <tbody>
                    {ranking.map((rank, index) => {
                        const isCurrentClub = rank.team.clubId === clubId;
                        return (
                            <tr
                                key={index}
                                className={`${isCurrentClub
                                    ? 'bg-primary text-black'
                                    : index % 2 === 0
                                        ? 'bg-white'
                                        : 'bg-gray-100'
                                    }`}
                            >
                                <td className="p-1 font-bold text-center">{rank.rank}</td>
                                <td className={`p-1 ${isCurrentClub ? 'font-bold' : ''}`}>{rank.team.name}</td>
                                <td className="p-1 text-right font-bold">{rank.nbPoints}</td>
                                <td className="p-1 text-right">{rank.nbMatchsPlayed}</td>
                                <td className="p-1 text-right">{rank.nbMatchsWin}</td>
                                <td className="p-1 text-right">{rank.nbMatchsEqual}</td>
                                <td className="p-1 text-right">{rank.nbMatchsLost}</td>
                                <td className="p-1 text-right">{rank.nbGoalsFor}</td>
                                <td className="p-1 text-right">{rank.nbGoalsAgainst}</td>
                                <td className="p-1 text-right">{rank.nbGoalsDiff}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default RankingTable;
