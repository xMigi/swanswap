/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      spacing: {
      '30': '7.5rem', // 120px
      '40': '10rem'   // 160px
    },
    fontFamily: {
      mono: ["Fira Code", "monospace"],
    }},
  },
  plugins: [],
};