// fff_data_manager.mjs
import axios from 'axios';
import utils from '../utils/utils.js';
import moment from 'moment-timezone';  // Importer moment-timezone

async function getClubTeams(clubId) {
    const url = `https://api-dofa.prd-aws.fff.fr/api/clubs/${clubId}/equipes`;

    try {
        const response = await axios.get(url);

        if (response.status === 200) {
            const data = response.data['hydra:member'];
            const allTeams = [];
            const clubName = data[0]['club']['name'] || '';

            for (const teamData of data) {
                if (teamData['engagements'].length > 0) {
                    const singleTeam = {
                        id: teamData['number'],
                        clubId: teamData['club']['cl_no'],
                        clubName: teamData['club']['name'],
                        categoryCode: teamData['category_code'],
                        code: teamData['code'],
                        codeLetter: utils.getLetterFromIndex(teamData['code']),
                        category: teamData['category_code'] === "SEM" ? "SENIORS" : teamData['category_code'],
                        name: `${teamData['short_name']} ${teamData['code']}`,
                        logoUrl: teamData['club']['logo'] || ''
                    };

                    singleTeam.title = `${singleTeam.category} ${singleTeam.codeLetter}`;

                    for (const competitionData of teamData['engagements']) {
                        if (competitionData['competition']['type'] === 'CH') {
                            const id = competitionData['competition']['cp_no'];
                            const name = competitionData['competition']['name'];
                            const type = competitionData['competition']['type'];
                            const phase = competitionData['phase']['number'];
                            const poule = competitionData['poule']['stage_number'];
                            const pouleLetter = utils.getLetterFromIndex(poule);

                            singleTeam.competition = {
                                id,
                                name,
                                type,
                                phase,
                                poule,
                                pouleLetter,
                            };
                        }
                    }

                    allTeams.push(singleTeam);
                }
            }

            return {
                clubName: clubName,
                teams: allTeams
            };
        } else {
            throw new Error(`Erreur de chargement des données pour le clubId : ${clubId}`);
        }
    } catch (error) {
        throw error;
    }
}


async function getGroupRanking(competitionId, phaseId, groupId) {
    try {
        // console.log('getGroupRanking');
        const url = `https://api-dofa.prd-aws.fff.fr/api/compets/${competitionId}/phases/${phaseId}/poules/${groupId}/classement_journees`;
        const response = await axios.get(url);

        if (response.status === 200) {
            const body = response.data;
            const data = body['hydra:member'];

            const allRankings = data.map((data) => {
                // console.log(data);

                var ranking = {
                    rank: data['rank'],
                    nbMatchsPlayed: data['total_games_count'],
                    nbMatchsWin: data['won_games_count'],
                    nbMatchsEqual: data['draw_games_count'],
                    nbMatchsLost: data['lost_games_count'],
                    nbGoalsFor: data['goals_for_count'],
                    nbGoalsAgainst: data['goals_against_count'],
                    nbGoalsDiff: data['goals_diff'],
                    nbPoints: data['point_count'],
                    nbPointsPenalties: data['penalty_point_count'],
                    forfeits: data['forfeits_games_count'],
                    groupDay: data['cj_no'],
                };

                ranking.team = {
                    id: data['equipe']['number'],
                    clubId: data['equipe']['club']['cl_no'],
                    categoryCode: data['equipe']['category_code'],
                    code: data['equipe']['code'],
                    category: data['equipe']['category_code'] === "SEM" ? "SENIORS" : data['equipe']['category_code'],
                    name: `${data['equipe']['short_name']} ${data['equipe']['code']}`,
                }

                // console.log(ranking);

                return ranking;
            });
            // console.log(allRankings);
            return allRankings;
        } else {
            throw new Error(`Erreur de chargement des données pour competitionId: ${competitionId}, phaseId: ${phaseId}, groupId: ${groupId}`);
        }
    } catch (error) {
        throw error;
    }
}

async function getCompetitionResults(competitionId, phaseId, groupId) {
    try {
        // console.log('getCompetitionResults');
        const url = `https://api-dofa.prd-aws.fff.fr/api/compets/${competitionId}/phases/${phaseId}/poules/${groupId}/resultat?page=1`;
        const response = await axios.get(url);

        if (response.status === 200) {
            const body = response.data;
            const data = body['hydra:member'];

            const allMatches = data.map((matchData) => {
                const match = {
                    id: matchData['ma_no'],
                    competitionId: matchData['competition']['cp_no'],
                    competitionName: matchData['competition']['name'],
                    phaseId: matchData['phase']['number'],
                    groupName: matchData['poule']['name'],
                    groupId: matchData['poule']['stage_number'],
                    groupDay: matchData['poule_journee']['number'],
                    matchStopped: matchData['ma_arret'] === "O" ? true : false,
                    homeTeam: matchData['home']
                        ? {
                            id: matchData['home']['number'],
                            clubId: matchData['home']['club']['cl_no'],
                            categoryCode: matchData['home']['category_code'],
                            code: matchData['home']['code'],
                            category: matchData['home']['category_code'] === "SEM" ? "SENIORS" : matchData['home']['category_code'],
                            name: `${matchData['home']['short_name']} ${matchData['home']['code']}`,
                            logoUrl: matchData['home']['club']['logo'] || '',
                        }
                        : { name: "EXEMPT" },
                    awayTeam: matchData['away']
                        ? {
                            id: matchData['away']['number'],
                            clubId: matchData['away']['club']['cl_no'],
                            categoryCode: matchData['away']['category_code'],
                            code: matchData['away']['code'],
                            category: matchData['away']['category_code'] === "SEM" ? "SENIORS" : matchData['away']['category_code'],
                            name: `${matchData['away']['short_name']} ${matchData['away']['code']}`,
                            logoUrl: matchData['away']['club']['logo'] || '',
                        }
                        : { name: "EXEMPT" },
                    stadium: matchData['terrain']
                        ? {
                            id: matchData['terrain']['te_no'],
                            name: matchData['terrain']['name'],
                            address: matchData['terrain']['address'],
                            city: matchData['terrain']['city'],
                            zipCode: matchData['terrain']['zip_code'],
                            surface: matchData['terrain']['libelle_surface'],
                        }
                        : null,
                    date: utils.formatFrenchDate(matchData['date']),
                    time: matchData['time'],
                    homeScore: matchData['home_score'],
                    homePenaltiesScore: matchData['home_nb_tir_but'],
                    awayScore: matchData['away_score'],
                    awayPenaltiesScore: matchData['away_nb_tir_but'],
                    forfeit: matchData['home_resu'] == "FM" || matchData['away_resu'] == "FM" ? true : false,
                };

                return match;
            });

            // console.log(allMatches);
            return allMatches;
        } else {
            throw new Error(`Erreur de chargement des données pour competitionId: ${competitionId}, phaseId: ${phaseId}, groupId: ${groupId}`);
        }
    } catch (error) {
        throw error;
    }
}

async function getCompetitionCalendar(competitionId, phaseId, groupId) {
    try {
        // console.log('getCompetitionCalendar');
        const url = `https://api-dofa.prd-aws.fff.fr/api/compets/${competitionId}/phases/${phaseId}/poules/${groupId}/calendrier?page=1`;
        const response = await axios.get(url);

        if (response.status === 200) {
            const body = response.data;
            const data = body['hydra:member'];

            const allMatches = data.map((matchData) => {
                const match = {
                    id: matchData['ma_no'],
                    competitionId: matchData['competition']['cp_no'],
                    competitionName: matchData['competition']['name'],
                    phaseId: matchData['phase']['number'],
                    groupName: matchData['poule']['name'],
                    groupId: matchData['poule']['stage_number'],
                    groupDay: matchData['poule_journee']['number'],
                    matchStopped: matchData['ma_arret'] === "O" ? true : false,
                    homeTeam: matchData['home']
                        ? {
                            id: matchData['home']['number'],
                            clubId: matchData['home']['club']['cl_no'],
                            categoryCode: matchData['home']['category_code'],
                            code: matchData['home']['code'],
                            category: matchData['home']['category_code'] === "SEM" ? "SENIORS" : matchData['home']['category_code'],
                            name: `${matchData['home']['short_name']} ${matchData['home']['code']}`,
                            logoUrl: matchData['home']['club']['logo'] || '',
                        }
                        : { name: "EXEMPT" },
                    awayTeam: matchData['away']
                        ? {
                            id: matchData['away']['number'],
                            clubId: matchData['away']['club']['cl_no'],
                            categoryCode: matchData['away']['category_code'],
                            code: matchData['away']['code'],
                            category: matchData['away']['category_code'] === "SEM" ? "SENIORS" : matchData['away']['category_code'],
                            name: `${matchData['away']['short_name']} ${matchData['away']['code']}`,
                            logoUrl: matchData['away']['club']['logo'] || '',
                        }
                        : { name: "EXEMPT" },
                    stadium: matchData['terrain']
                        ? {
                            id: matchData['terrain']['te_no'],
                            name: matchData['terrain']['name'],
                            address: matchData['terrain']['address'],
                            city: matchData['terrain']['city'],
                            zipCode: matchData['terrain']['zip_code'],
                            surface: matchData['terrain']['libelle_surface'],
                        }
                        : null,
                    date: utils.formatFrenchDate(matchData['date']),
                    time: matchData['time'],
                    homeScore: matchData['home_score'],
                    homePenaltiesScore: matchData['home_nb_tir_but'],
                    awayScore: matchData['away_score'],
                    awayPenaltiesScore: matchData['away_nb_tir_but'],
                    forfeit: matchData['home_resu'] == "FM" || matchData['away_resu'] == "FM" ? true : false,
                };

                return match;
            });

            // console.log(allMatches);
            return allMatches;
        } else {
            throw new Error(`Erreur de chargement des données pour competitionId: ${competitionId}, phaseId: ${phaseId}, groupId: ${groupId}`);
        }
    } catch (error) {
        throw error;
    }
}

async function getCompetitionTeams(competitionId, phaseId, groupId) {
    try {
        // console.log('getCompetitionTeams');
        const url = `https://api-dofa.prd-aws.fff.fr/api/engagements?competition.cp_no=${competitionId}&phase.ph_no=${phaseId}&poule.gp_no=${groupId}`;
        const response = await axios.get(url);

        if (response.status === 200) {
            const body = response.data;
            const data = body['hydra:member'];

            const allRankings = data.map((data, index) => {
                var ranking = {
                    rank: index + 1,
                    nbMatchsPlayed: 0,
                    nbMatchsWin: 0,
                    nbMatchsEqual: 0,
                    nbMatchsLost: 0,
                    nbGoalsFor: 0,
                    nbGoalsAgainst: 0,
                    nbGoalsDiff: 0,
                    nbPoints: 0,
                    nbPointsPenalties: 0,
                    forfeits: 0,
                    groupDay: 0,
                };

                ranking.team = {
                    id: data['equipe']['number'],
                    clubId: data['equipe']['club']['cl_no'],
                    categoryCode: data['equipe']['category_code'],
                    code: data['equipe']['code'],
                    category: data['equipe']['category_code'] === "SEM" ? "SENIORS" : data['equipe']['category_code'],
                    name: `${data['equipe']['short_name']} ${data['equipe']['code']}`,
                }
                return ranking;
            });
            // console.log(allRankings);
            return allRankings;
        } else {
            throw new Error(`Erreur de chargement des données pour competitionId: ${competitionId}, phaseId: ${phaseId}, groupId: ${groupId}`);
        }
    } catch (error) {
        throw error;
    }
}

async function getNextTeamMatch(clubId, teamId) {
    const date_after = utils.getCurrentDate(); // Date actuelle en format 'YYYY-MM-DD'
    const date_before = utils.getNext2MonthDate(); // Date deux mois après

    const url = `https://api-dofa.prd-aws.fff.fr/api/clubs/${clubId}/equipes/${teamId}/calendrier?ma_dat[after]=${date_after}&ma_dat[before]=${date_before}`;

    try {
        const response = await axios.get(url);

        if (response.status === 200) {
            let matches = response.data['hydra:member'];

            // Obtenez l'heure actuelle dans le fuseau Europe/Paris
            const now = moment().tz('Europe/Paris');

            // Fonction pour convertir l'heure au format 'HHH' en 'HH:mm'
            const convertTimeFormat = (timeStr) => {
                if (!timeStr || !timeStr.match(/^\d{1,2}H\d{2}$/)) {
                    return '00:00'; // Si l'heure est incorrecte, retourner '00:00' par défaut
                }
                return timeStr.replace('H', ':'); // Transformer '15H00' en '15:00'
            };

            // Fonction pour combiner la date et l'heure en un objet Date
            const parseMatchDateTime = (isoDateStr, timeStr) => {
                const correctedTime = convertTimeFormat(timeStr); // Corrige le format de l'heure
                const dateOnly = moment(isoDateStr).format('YYYY-MM-DD'); // On garde seulement la date au format ISO
                const dateTimeStr = `${dateOnly}T${correctedTime}:00`; // Fusionne la date et l'heure
                return moment.tz(dateTimeStr, 'Europe/Paris').toDate(); // Retourne la date en Europe/Paris
            };

            // Convertir les dates et heures des matchs en objets Date, puis trier par date
            matches = matches.map(match => {
                const dateObj = parseMatchDateTime(match['date'], match['time']);
                return { ...match, dateObj };
            }).sort((a, b) => a.dateObj - b.dateObj);

            // Trouver le prochain match qui se déroule après l'heure actuelle
            const nextMatch = matches.find(match => match.dateObj > now);

            if (nextMatch) {
                // Construire et retourner l'objet match
                return {
                    id: nextMatch['ma_no'],
                    competitionId: nextMatch['competition']['cp_no'],
                    competitionName: nextMatch['competition']['name'],
                    competitionType: nextMatch['competition']['type'],
                    phaseId: nextMatch['phase']['number'],
                    groupName: nextMatch['poule']['name'],
                    groupId: nextMatch['poule']['stage_number'],
                    groupDay: nextMatch['poule_journee']['number'],
                    matchStopped: nextMatch['ma_arret'] === "O" ? true : false,
                    homeTeam: nextMatch['home']
                        ? {
                            id: nextMatch['home']['number'],
                            clubId: nextMatch['home']['club']['cl_no'],
                            categoryCode: nextMatch['home']['category_code'],
                            code: nextMatch['home']['code'],
                            category: nextMatch['home']['category_code'] === "SEM" ? "SENIORS" : nextMatch['home']['category_code'],
                            name: `${nextMatch['home']['short_name']} ${nextMatch['home']['code']}`,
                            logoUrl: nextMatch['home']['club']['logo'] || '',
                        }
                        : { name: "EXEMPT" },
                    awayTeam: nextMatch['away']
                        ? {
                            id: nextMatch['away']['number'],
                            clubId: nextMatch['away']['club']['cl_no'],
                            categoryCode: nextMatch['away']['category_code'],
                            code: nextMatch['away']['code'],
                            category: nextMatch['away']['category_code'] === "SEM" ? "SENIORS" : nextMatch['away']['category_code'],
                            name: `${nextMatch['away']['short_name']} ${nextMatch['away']['code']}`,
                            logoUrl: nextMatch['away']['club']['logo'] || '',
                        }
                        : { name: "EXEMPT" },
                    stadium: nextMatch['terrain']
                        ? {
                            id: nextMatch['terrain']['te_no'],
                            name: nextMatch['terrain']['name'],
                            address: nextMatch['terrain']['address'],
                            city: nextMatch['terrain']['city'],
                            zipCode: nextMatch['terrain']['zip_code'],
                            surface: nextMatch['terrain']['libelle_surface'],
                        }
                        : null,
                    date: utils.formatFrenchDate(nextMatch['date']), // Formater la date pour l'affichage
                    time: nextMatch['time'],
                    homeScore: nextMatch['home_score'],
                    homePenaltiesScore: nextMatch['home_nb_tir_but'],
                    awayScore: nextMatch['away_score'],
                    awayPenaltiesScore: nextMatch['away_nb_tir_but'],
                    forfeit: nextMatch['home_resu'] == "FM" || nextMatch['away_resu'] == "FM" ? true : false,
                };
            } else {
                return null; // Aucun match trouvé après la date actuelle
            }
        } else {
            throw new Error('Erreur de chargement des données');
        }
    } catch (error) {
        console.error(error.message);
        return null;
    }
}


async function getLastTeamMatch(clubId, teamId) {
    // console.log('getLastTeamMatch');
    const url = `https://api-dofa.prd-aws.fff.fr/api/clubs/${clubId}/equipes/${teamId}/resultat`;

    try {
        const response = await axios.get(url);

        if (response.status === 200) {
            const data = response.data['hydra:member'][0];
            // console.log(data);

            var match = {
                id: data['ma_no'],
                competitionId: data['competition']['cp_no'],
                competitionName: data['competition']['name'],
                competitionType: data['competition']['type'],
                phaseId: data['phase']['number'],
                groupName: data['poule']['name'],
                groupId: data['poule']['stage_number'],
                groupDay: data['poule_journee']['number'],
                matchStopped: data['ma_arret'] == "O" ? true : false,
                homeTeam: data['home']
                    ? {
                        id: data['home']['number'],
                        clubId: data['home']['club']['cl_no'],
                        categoryCode: data['home']['category_code'],
                        code: data['home']['code'],
                        category:
                            data['home']['category_code'] === "SEM"
                                ? "SENIORS"
                                : data['home']['category_code'],
                        name: `${data['home']['short_name']} ${data['home']['code']}`,
                        logoUrl: data['home']['club']['logo'] || '',
                    }
                    : { name: "EXEMPT" },
                awayTeam: data['away']
                    ? {
                        id: data['away']['number'],
                        clubId: data['away']['club']['cl_no'],
                        categoryCode: data['away']['category_code'],
                        code: data['away']['code'],
                        category:
                            data['away']['category_code'] === "SEM"
                                ? "SENIORS"
                                : data['away']['category_code'],
                        name: `${data['away']['short_name']} ${data['away']['code']}`,
                        logoUrl: data['away']['club']['logo'] || '',
                    }
                    : { name: "EXEMPT" },
                stadium: data['terrain']
                    ? {
                        id: data['terrain']['te_no'],
                        name: data['terrain']['name'],
                        address: data['terrain']['address'],
                        city: data['terrain']['city'],
                        zipCode: data['terrain']['zip_code'],
                        surface: data['terrain']['libelle_surface'],
                    }
                    : null,
                date: utils.formatFrenchDate(data['date']),
                time: data['time'],
                homeScore: data['home_score'],
                homePenaltiesScore: data['home_nb_tir_but'],
                awayScore: data['away_score'],
                awayPenaltiesScore: data['away_nb_tir_but'],
                forfeit: data['home_resu'] == "FM" || data['away_resu'] == "FM" ? true : false,
            };

            return match;
        } else {
            throw new Error('Erreur de chargement des données');
        }

    } catch (error) {
        console.error(error.message);
        return null;
    }
}

export { getClubTeams, getGroupRanking, getNextTeamMatch, getLastTeamMatch, getCompetitionTeams, getCompetitionResults, getCompetitionCalendar };