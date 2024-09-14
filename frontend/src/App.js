import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import ClubPage from './components/ClubPage';
import ErrorPage from './components/ErrorPage';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://api.classements.esmorannes.com';

const App = () => {
  const [pagesData, setPagesData] = useState([]); // Stocker les pages (groupes d'équipes par club)
  const [currentIndex, setCurrentIndex] = useState(0); // Index du club à afficher
  const [error, setError] = useState(null);
  const [statusCode, setStatusCode] = useState(null);

  // Fonction pour récupérer les données et les regrouper
  const fetchAndSetClubsData = async () => {
    try {
      const response = await axios.get(API_BASE_URL + '/api/teams');

      // Filtrer les clubs qui ont des équipes
      const clubsWithTeams = response.data.filter(club => club.teams && club.teams.length > 0);

      // Regrouper les équipes par tranches de 3
      const clubsWithGroupedTeams = clubsWithTeams.flatMap(club => {
        const sortedTeams = club.teams.sort((a, b) => a.id - b.id); // Trier les équipes par ID
        const groupedTeams = [];

        // Diviser les équipes en groupes de 3
        for (let i = 0; i < sortedTeams.length; i += 3) {
          groupedTeams.push({
            ...club, // Conserver les informations du club
            teams: sortedTeams.slice(i, i + 3), // Regrouper les équipes par paquets de 3
          });
        }

        return groupedTeams;
      });

      setPagesData(clubsWithGroupedTeams); // Mettre à jour les données
      setError(null); // Réinitialiser les erreurs
      setStatusCode(null); // Réinitialiser les codes d'état
      setCurrentIndex(0); // Revenir au début du cycle après une nouvelle récupération des données
    } catch (error) {
      // Gérer les erreurs comme auparavant
      if (error.response) {
        const statusCode = error.response.status;
        setStatusCode(statusCode);
        if (statusCode === 404) {
          setError('Données non trouvées (404). Veuillez réessayer plus tard.');
        } else if (statusCode === 500) {
          setError('Erreur interne du serveur (500). Veuillez réessayer plus tard.');
        } else {
          setError(`Une erreur s'est produite : ${statusCode}. Veuillez réessayer plus tard.`);
        }
      } else if (error.request) {
        setStatusCode(null);
        setError('Aucune réponse du serveur. Veuillez vérifier votre connexion réseau.');
      } else {
        setStatusCode(null);
        setError("Une erreur inattendue s'est produite. Veuillez réessayer plus tard.");
      }
    }
  };

  // Utiliser l'effet pour récupérer les données lors du montage initial
  useEffect(() => {
    fetchAndSetClubsData();
  }, []);

  // Changer automatiquement de club toutes les minutes (60 secondes) après avoir reçu les données
  useEffect(() => {
    if (pagesData.length > 0) {  // Vérifier si les données sont chargées
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          const newIndex = (prevIndex + 1) % pagesData.length;

          // Si on est revenu au début (boucle terminée), on récupère de nouvelles données
          if (newIndex === 0) {
            fetchAndSetClubsData(); // Actualiser les données après chaque cycle complet
          }

          return newIndex;
        });
      }, 60000); // 60 000 millisecondes = 1 minute

      // Nettoyer l'intervalle lorsque le composant est démonté
      return () => clearInterval(interval);
    }
  }, [pagesData]); // Exécuter l'effet lorsque `pagesData` change

  // Affichage en cas d'erreur
  if (error) {
    return <ErrorPage message={error} statusCode={statusCode} />;
  }

  // Affichage lors du chargement des données
  if (pagesData.length === 0) {
    return (
      <div>
        <p>Chargement des données des clubs...</p>
      </div>
    );
  }

  // Rendre le club actuel (ou le groupe de 3 équipes)
  return (
    <div>
      <ClubPage club={pagesData[currentIndex]} />
    </div>
  );
};

export default App;
