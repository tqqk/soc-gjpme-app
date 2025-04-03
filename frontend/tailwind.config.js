/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./js/quiz.js",
    "./js/passphrase-gen.js",
    "./*.html",
  ],
  theme: {
    extend: {
      colors: {
        'black-white': 'rgb(245, 245, 245)',
      },
      fontFamily: {
        robotoMono: ['Roboto Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
