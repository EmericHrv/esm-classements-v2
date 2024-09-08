require('dotenv').config();

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#fff385', // Couleur dérivée claire
          DEFAULT: '#ffde00', // Couleur primaire par défaut
          dark: '#ccaf00', // Couleur dérivée foncée
        },
        text: {
          DEFAULT: '#000000', // Par défaut blanc, peut être noir
        },
      },
    },
  },
  plugins: [],
}
