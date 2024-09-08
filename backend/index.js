import express from 'express';
import dotenv from 'dotenv';
import http from 'http';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { getClubTeams, getGroupRanking, getNextTeamMatch, getLastTeamMatch, getCompetitionTeams, getCompetitionResults, getCompetitionCalendar } from './webapp/assets/js/fff/fff_data_module.mjs';

dotenv.config();
const { NODE_ENV } = process.env;

const version = "2.1.1";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const __webapp = __dirname + '/webapp';

const app = express();
const httpPort = process.env.HTTP_PORT || 8080;
const httpServer = http.createServer(app);

const log = console.log;

//////////////////CLUBS INFOS/////////////////////
const clubIDs = process.env.CLUB_IDS.split(',').map(id => parseInt(id, 10));


function getTIMESTAMP() {
    var date = new Date();
    var year = date.getFullYear();
    var month = ("0" + (date.getMonth() + 1)).substring(-2);
    var day = ("0" + date.getDate()).substring(-2);
    var hour = ("0" + date.getHours()).substring(-2);
    var minutes = ("0" + date.getMinutes()).substring(-2);
    var seconds = ("0" + date.getSeconds()).substring(-2);

    return day + "-" + month + "-" + year + " " + hour + ":" + minutes + ":" + seconds;
}

// Middleware pour parser le corps des requêtes en JSON
app.use(express.json());

if (NODE_ENV === 'dev') {
    app.use(cors());
} else {
    console.log('Environnement de production');
    // Middleware CORS
    app.use(cors({
        origin: 'https://classements.esmorannes.com',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization']
    }));
}

/**
   *  App API
   */
app.get("/api/teams", async (req, res) => {
    try {
        const teams = await getAllTeams(clubIDs);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(teams, null, 2)); // Format JSON with 2 spaces indentation
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Unable to fetch teams' });
    }
});


// Route pour récupérer les classements par équipe
app.post("/api/rankings", async (req, res) => {
    const { clubId, teams } = req.body;

    if (!clubId || !Array.isArray(teams)) {
        return res.status(400).json({ error: 'Invalid request body. Must contain clubId and an array of teams.' });
    }

    try {
        const rankings = await fetchAndAssignRankings(teams);
        const result = {
            clubId,
            teams,
            rankings
        };

        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(result, null, 2)); // 2 est le nombre d'espaces pour l'indentation
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Unable to fetch rankings' });
    }
});

// Route pour récupérer le classement d'une competition
app.post("/api/ranking", async (req, res) => {
    const { competitionId, phaseId, groupId } = req.body;

    if (!competitionId || !phaseId || !groupId) {
        return res.status(400).json({ error: 'Invalid request body. Must contain competitionId, phaseId, and groupId.' });
    }

    try {
        const ranking = await getGroupRanking(competitionId, phaseId, groupId);
        var result = null;
        if (ranking.length === 0) {
            const temporaryRanking = await getCompetitionTeams(competitionId, phaseId, groupId);
            result = {
                competitionId,
                phaseId,
                groupId,
                ranking: temporaryRanking
            };
        } else {
            result = {
                competitionId,
                phaseId,
                groupId,
                ranking
            };
        }

        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(result, null, 2)); // 2 est le nombre d'espaces pour l'indentation
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Unable to fetch ranking' });
    }
});

// Route pour récupérer le prochain match d'une équipe
app.post("/api/nextmatch", async (req, res) => {
    const { clubId, teamId } = req.body;

    if (!clubId || !teamId) {
        return res.status(400).json({ error: 'Invalid request body. Must contain clubId and teamId.' });
    }

    try {
        const nextMatch = await getNextTeamMatch(clubId, teamId);
        const result = {
            clubId,
            teamId,
            nextMatch: nextMatch || null,
            hasNextMatch: nextMatch !== null
        };

        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(result, null, 2)); // 2 est le nombre d'espaces pour l'indentation
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Unable to fetch next match' });
    }
});

// Route pour récupérer le dernier match d'une équipe
app.post("/api/lastmatch", async (req, res) => {
    const { clubId, teamId } = req.body;

    if (!clubId || !teamId) {
        return res.status(400).json({ error: 'Invalid request body. Must contain clubId and teamId.' });
    }

    try {
        const lastMatch = await getLastTeamMatch(clubId, teamId);
        const result = {
            clubId,
            teamId,
            lastMatch: lastMatch || null,
            hasLastMatch: lastMatch !== null
        };

        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(result, null, 2)); // 2 est le nombre d'espaces pour l'indentation
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Unable to fetch last match' });
    }
});

// Route pour récupérer les résultats d'une compétition
app.post("/api/competitionresults", async (req, res) => {
    const { competitionId, phaseId, groupId } = req.body;

    if (!competitionId || !phaseId || !groupId) {
        return res.status(400).json({ error: 'Invalid request body. Must contain competitionId, phaseId, and groupId.' });
    }

    try {
        const results = await getCompetitionResults(competitionId, phaseId, groupId);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(results, null, 2)); // 2 est le nombre d'espaces pour l'indentation
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Unable to fetch competition results' });
    }
});

// Route pour récupérer les résultats d'une compétition
app.post("/api/competitioncalendar", async (req, res) => {
    const { competitionId, phaseId, groupId } = req.body;

    if (!competitionId || !phaseId || !groupId) {
        return res.status(400).json({ error: 'Invalid request body. Must contain competitionId, phaseId, and groupId.' });
    }

    try {
        const results = await getCompetitionCalendar(competitionId, phaseId, groupId);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(results, null, 2)); // 2 est le nombre d'espaces pour l'indentation
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Unable to fetch competition results' });
    }
});

// Fonctions auxiliaires
async function getTeams(clubID) {
    const teams = await getClubTeams(clubID);
    return teams;
}

const getAllTeams = async (clubIDs) => {
    const allTeams = await Promise.all(clubIDs.map(async (clubID) => {
        const { clubName, teams } = await getClubTeams(clubID);
        return { clubId: clubID, clubName, teams };
    }));

    return allTeams;
};


async function fetchAndAssignTemporaryRankings(teams) {
    const temporaryRankingPromises = teams.map((team) =>
        getCompetitionTeams(team.competition.id, team.competition.phase, team.competition.poule)
            .then(async (temporaryRanking) => {
                team.ranking = temporaryRanking;
            })
            .catch(handleError)
    );

    await Promise.all(temporaryRankingPromises);
}

async function fetchAndAssignRankings(teams) {
    const rankingPromises = teams.map((team) => {
        if (team.competition != null) {
            return getGroupRanking(team.competition.id, team.competition.phase, team.competition.poule)
                .then(async (ranking) => {
                    if (ranking.length === 0) {
                        await fetchAndAssignTemporaryRankings([team]);
                    } else {
                        team.ranking = ranking;
                    }
                })
                .catch(handleError);
        } else {
            return team.ranking = null;
        }
    });

    await Promise.all(rankingPromises);
}


async function fetchAndAssignMatches(clubID, teams, matchFetchFunction, propertyName) {
    const matchPromises = teams.map((team) =>
        matchFetchFunction(clubID, team.id)
            .then((match) => {
                team[propertyName] = match;
            })
            .catch(handleError)
    );

    await Promise.all(matchPromises);
}

function handleError(error) {
    console.error('FetchError:', error.message);
}

// Catch-all route for 404
app.use(function (req, res) {
    res.status(404).json({ error: '404 not found' });
});

/**
  * Server Activation
  */
httpServer.listen(httpPort, () => {
    log(getTIMESTAMP() + ' : ' + "Server v" + version + " starts on http://localhost:" + httpPort);
});
