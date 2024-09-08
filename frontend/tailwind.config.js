require('dotenv').config();

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: process.env.PRIMARY_LIGHT || '#A493FF', // Couleur dérivée claire
          DEFAULT: process.env.PRIMARY_DEFAULT || '#773EEF', // Couleur primaire par défaut
          dark: process.env.PRIMARY_DARK || '#5A2EBF', // Couleur dérivée foncée
        },
        text: {
          DEFAULT: process.env.TEXT_COLOR || '#FFFFFF', // Par défaut blanc, peut être noir
        },
      },
    },
  },
  plugins: [],
}
