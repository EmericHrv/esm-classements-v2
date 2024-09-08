import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MatchCard from './MatchCard';
import RankingTable from './RankingTable';
import TeamHeaderCard from './TeamHeaderCard';
import CompetitionResult from './CompetitionResult';
import CompetitionCalendar from './CompetitionCalendar';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://api.classements.esmorannes.com';

const TeamColumn = ({ team, clubId, index }) => {  // Ajout de 'index' venant du parent
    const [ranking, setRanking] = useState([]);
    const [lastMatch, setLastMatch] = useState(null);
    const [nextMatch, setNextMatch] = useState(null);

    useEffect(() => {
        const fetchRanking = async () => {
            try {
                const response = await axios.post(`${API_BASE_URL}/api/ranking`, {
                    competitionId: team.competition.id,
                    phaseId: team.competition.phase,
                    groupId: team.competition.poule,
                });
                setRanking(response.data.ranking);
            } catch (error) {
                console.error('Error fetching ranking:', error);
            }
        };

        const fetchLastMatch = async () => {
            try {
                const response = await axios.post(`${API_BASE_URL}/api/lastmatch`, {
                    clubId,
                    teamId: team.id,
                });
                setLastMatch(response.data.lastMatch);
            } catch (error) {
                console.error('Error fetching last match:', error);
            }
        };

        const fetchNextMatch = async () => {
            try {
                const response = await axios.post(`${API_BASE_URL}/api/nextmatch`, {
                    clubId,
                    teamId: team.id,
                });
                setNextMatch(response.data.nextMatch);
            } catch (error) {
                console.error('Error fetching next match:', error);
            }
        };

        fetchRanking();
        fetchLastMatch();
        fetchNextMatch();
    }, [team, clubId]);

    return (
        <div className="bg-white shadow-lg rounded-lg p-4 flex-1">
            <TeamHeaderCard
                title={team.title}
                competitionName={team.competition ? team.competition.name : ''}
                poule={team.competition ? `Poule ${team.competition.pouleLetter}` : ''}
            />

            {/* Utilisation de l'index global passé en prop pour définir quelle vue afficher */}
            {index === 0 && (
                <div className="mt-4">
                    {ranking.length > 0 && (
                        <div className="mb-4">
                            <RankingTable ranking={ranking} clubId={clubId} />
                        </div>
                    )}
                    <div className="mb-4">
                        <MatchCard clubId={clubId} match={lastMatch} title="Dernier Match" />
                    </div>
                    <div className="mb-4">
                        <MatchCard clubId={clubId} match={nextMatch} title="Prochain Match" />
                    </div>
                </div>
            )}

            {index === 1 && (
                <div className="mt-4">
                    <CompetitionResult team={team} />
                </div>
            )}

            {index === 2 && (
                <div className="mt-4">
                    <CompetitionCalendar team={team} />
                </div>
            )}
        </div>
    );
};

export default TeamColumn;
