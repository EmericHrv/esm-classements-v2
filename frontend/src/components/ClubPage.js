import React, { useState, useEffect } from 'react';
import TeamColumn from './TeamColumn';
import Header from './Header';

const ClubPage = ({ club }) => {
    const sortedTeams = club.teams.sort((a, b) => a.id - b.id);

    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prevIndex) => (prevIndex + 1) % 3);
        }, 15000); // Change view every 15 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="club-page w-full">
            <Header title={`Équipes ${club.clubName}`} />

            <div className="flex flex-wrap gap-4 px-4 mt-2">
                {sortedTeams.length > 0 ? (
                    sortedTeams.map((team) => (
                        <TeamColumn key={team.id} team={team} clubId={club.clubId} index={index} />
                    ))
                ) : (
                    <p className="text-center w-full mt-4">Aucune équipe engagée en compétition pour le moment</p>
                )}
            </div>
        </div>
    );
};

export default ClubPage;
