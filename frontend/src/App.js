import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import ClubPage from './components/ClubPage';
import ErrorPage from './components/ErrorPage';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://api.classements.esmorannes.com';

const App = () => {
  const [pagesData, setPagesData] = useState([]); // We store pages of clubs and team groups
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState(null);
  const [statusCode, setStatusCode] = useState(null);

  // Function to fetch and filter clubs with teams
  const fetchAndSetClubsData = async () => {
    try {
      const response = await axios.get(API_BASE_URL + '/api/teams');

      // Filter out clubs that have no teams
      const clubsWithTeams = response.data.filter(club => club.teams && club.teams.length > 0);

      // Sort teams by team.id and split them into groups of 3
      const clubsWithGroupedTeams = clubsWithTeams.flatMap(club => {
        // Sort teams by team.id
        const sortedTeams = club.teams.sort((a, b) => a.id - b.id);

        // Split teams into groups of 3
        const groupedTeams = [];
        for (let i = 0; i < sortedTeams.length; i += 3) {
          groupedTeams.push({
            ...club, // Spread the entire club object to pass it later
            teams: sortedTeams.slice(i, i + 3), // Grouping teams in chunks of 3
          });
        }
        return groupedTeams;
      });

      setPagesData(clubsWithGroupedTeams);
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
        setError("Une erreur inattendue s'est produite. Veuillez réessayer plus tard.");
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
      if (pagesData.length > 0) {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % pagesData.length); // Change page every minute
      }
    }, 6000); // Change every minute

    return () => clearInterval(interval);
  }, [pagesData]);

  if (error) {
    return <ErrorPage message={error} statusCode={statusCode} />;
  }

  if (pagesData.length === 0) {
    return (
      <div>
        <p>Chargement des données des clubs...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Pass the entire club object instead of just clubName and teams */}
      <ClubPage club={pagesData[currentIndex]} />
    </div>
  );
};

export default App;
