import React from 'react';
import MatchCard from './MatchCard';
import RankingTable from './RankingTable';
import TeamHeaderCard from './TeamHeaderCard';

const TeamColumn = ({ team }) => {
    return (
        <div className="bg-white shadow-lg rounded-lg p-4 flex-1">
            <TeamHeaderCard
                title={team.title}
                competitionName={team.competition ? team.competition.name : ''}
                poule={team.competition ? `Poule ${team.competition.pouleLetter}` : ''}
            />

            {team.ranking && team.ranking.length > 0 && (
                <div className="mt-4">
                    <RankingTable ranking={team.ranking} clubId={team.clubId} />
                </div>
            )}

            <div className="mt-4">
                <MatchCard match={team.lastMatch} title="Dernier Match" />
            </div>

            <div className="mt-4">
                <MatchCard match={team.nextMatch} title="Prochain Match" />
            </div>
        </div>
    );
};

export default TeamColumn;
