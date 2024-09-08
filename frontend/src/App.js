import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import ClubPage from './components/ClubPage';
import ErrorPage from './components/ErrorPage';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://api.classements.esmorannes.com';

const App = () => {
  const [clubsData, setClubsData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState(null);
  const [statusCode, setStatusCode] = useState(null);

  // Function to fetch and filter clubs with teams
  const fetchAndSetClubsData = async () => {
    try {
      const response = await axios.get(API_BASE_URL + '/api/teams');

      // Filter out clubs that have no teams
      const clubsWithTeams = response.data.filter(club => club.teams && club.teams.length > 0);

      setClubsData(clubsWithTeams);
      setError(null); // Clear any previous errors if the fetch is successful
      setStatusCode(null); // Clear the status code if the fetch is successful
    } catch (error) {
      // Handle different error types and status codes
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
        setError('Une erreur inattendue s\'est produite. Veuillez réessayer plus tard.');
      }
      console.error('Erreur lors de la récupération des données des équipes:', error);
    }
  };

  useEffect(() => {
    fetchAndSetClubsData();

    const fetchInterval = setInterval(() => {
      fetchAndSetClubsData(); // Re-fetch clubs and teams every minute
    }, 60000); // 1 minute in milliseconds

    return () => clearInterval(fetchInterval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (clubsData.length > 0) {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % clubsData.length); // Change club every minute
      }
    }, 60000); // Change every minute

    return () => clearInterval(interval);
  }, [clubsData]);

  if (error) {
    return <ErrorPage message={error} statusCode={statusCode} />;
  }

  if (clubsData.length === 0) {
    return (
      <div>
        <p>Chargement des données des clubs...</p>
      </div>
    );
  }

  return (
    <div>
      <ClubPage club={clubsData[currentIndex]} />
    </div>
  );
};

export default App;
