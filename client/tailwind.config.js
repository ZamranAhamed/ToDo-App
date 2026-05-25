/** @type {import('tailwindcss').Config} */
export default {
  // Dark mode: Tailwind applies dark styles when a parent has class="dark".
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {}
  },
  plugins: []
};
