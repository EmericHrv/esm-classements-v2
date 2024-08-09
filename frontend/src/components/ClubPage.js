import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import TeamColumn from './TeamColumn';
import Header from './Header';

const baseUrl = "http://localhost:8080";

const ClubPage = ({ club }) => {
    const [teamsDetails, setTeamsDetails] = useState([]);
    const teamColumnsRefs = useRef([]);

    useEffect(() => {
        const fetchTeamDetails = async () => {
            try {
                const rankingsResponse = await axios.post(baseUrl + '/api/rankings', {
                    clubId: club.clubId,
                    clubName: club.clubName,
                    teams: club.teams,
                });

                const updatedTeams = await Promise.all(
                    rankingsResponse.data.teams.map(async (team) => {
                        const nextMatchResponse = await axios.post(baseUrl + '/api/nextmatch', {
                            clubId: club.clubId,
                            teamId: team.id,
                        });

                        const lastMatchResponse = await axios.post(baseUrl + '/api/lastmatch', {
                            clubId: club.clubId,
                            teamId: team.id,
                        });

                        return {
                            ...team,
                            nextMatch: nextMatchResponse.data.nextMatch || null,
                            lastMatch: lastMatchResponse.data.lastMatch || null,
                        };
                    })
                );

                // Trier les équipes selon les critères spécifiés
                updatedTeams.sort((a, b) => a.title.localeCompare(b.title));

                setTeamsDetails(updatedTeams);
            } catch (error) {
                console.error('Error fetching team details:', error);
            }
        };

        fetchTeamDetails();
    }, [club]);

    return (
        <div className="club-page w-full">
            <Header title={`Classements Équipes ${club.clubName}`} />
            <div className="flex flex-wrap gap-4 px-4 mt-2">
                {teamsDetails.length > 0 ? (
                    teamsDetails.map((team, index) => (
                        <TeamColumn
                            key={team.id}
                            team={team}
                            ref={el => teamColumnsRefs.current[index] = el}
                        />
                    ))
                ) : (
                    <p className="text-center w-full mt-4">Aucune équipe engagée en compétition pour le moment</p>
                )}
            </div>
        </div>
    );
};

export default ClubPage;
