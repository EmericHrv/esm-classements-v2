import moment from 'moment-timezone';  // Importer moment-timezone pour gérer les fuseaux horaires

function getLetterFromIndex(index) {
    if (index >= 1 && index <= 26) {
        return String.fromCharCode(64 + index);
    } else {
        throw new Error("L'index doit être compris entre 1 et 26 inclus.");
    }
}

function formatFrenchDate(dateString) {
    // Parse la date avec moment dans le fuseau horaire Europe/Paris
    const parsedDate = moment.tz(dateString, 'Europe/Paris');

    // Formate la date selon le format souhaité en français
    const formattedDate = parsedDate.locale('fr').format('ddd DD MMMM');

    // Capitalize the first letter of the day and month
    const capitalizedDate = formattedDate.replace(/(?:^|\s)\S/g, match => match.toUpperCase());

    // Retourne la date formatée
    return capitalizedDate;
}

// Fonction pour obtenir la date actuelle dans le fuseau Europe/Paris
function getCurrentDate() {
    return moment().tz('Europe/Paris').format('YYYY-MM-DD');
}

// Fonction pour obtenir la date du jour suivant dans le fuseau Europe/Paris
function getNextDayDate() {
    return moment().tz('Europe/Paris').add(1, 'day').format('YYYY-MM-DD');
}

// Fonction pour obtenir la date dans 2 mois dans le fuseau Europe/Paris
function getNext2MonthDate() {
    return moment().tz('Europe/Paris').add(2, 'month').format('YYYY-MM-DD');
}

export default {
    getLetterFromIndex: getLetterFromIndex,
    formatFrenchDate: formatFrenchDate,
    getCurrentDate: getCurrentDate,
    getNextDayDate: getNextDayDate,
    getNext2MonthDate: getNext2MonthDate
};
