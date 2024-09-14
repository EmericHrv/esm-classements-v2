import React, { useState, useEffect } from 'react';
import TeamColumn from './TeamColumn';
import Header from './Header';

const ClubPage = ({ club }) => {
    // État pour l'index de l'équipe actuellement affichée
    const [index, setIndex] = useState(0);

    useEffect(() => {
        // Réinitialiser l'index à 0 à chaque fois que le club change
        setIndex(0);

        // Créer un intervalle qui met à jour l'index toutes les 20 secondes
        const interval = setInterval(() => {
            setIndex((prevIndex) => (prevIndex + 1) % 3); // Alterner entre 0, 1 et 2
        }, 20000); // Changer toutes les 20 secondes

        // Nettoyer l'intervalle lorsque le composant est démonté ou que le club change
        return () => clearInterval(interval);
    }, [club]); // Dépendance sur le club pour redémarrer à chaque changement

    return (
        <div className="club-page w-full">
            {/* Titre du club */}
            <Header title={club.clubName} />

            {/* Afficher les équipes */}
            <div className="flex flex-wrap gap-4 px-4 mt-2">
                {club.teams.length > 0 ? (
                    club.teams.map((team) => (
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
