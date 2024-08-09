import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import ClubPage from './components/ClubPage';

const baseUrl = "http://localhost:8080";

const App = () => {
  const [teamsData, setTeamsData] = useState([]);
  const [currentClubIndex, setCurrentClubIndex] = useState(0);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get(baseUrl + '/api/teams');
        console.log("Teams data received:", response.data);  // Log the data received
        setTeamsData(response.data);
      } catch (error) {
        console.error('Error fetching teams data:', error);
      }
    };

    fetchTeams();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentClubIndex((prevIndex) => (prevIndex + 1) % teamsData.length);
    }, 60000); // Changer de club toutes les minutes

    return () => clearInterval(interval);
  }, [teamsData]);

  return (
    <div>
      {teamsData.length > 0 ? (
        <ClubPage club={teamsData[currentClubIndex]} />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default App;
