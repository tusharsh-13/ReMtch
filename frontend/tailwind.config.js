/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#020617",
        surface: "rgba(15,23,42,0.9)",
        accent: {
          DEFAULT: "#6366f1",
          soft: "#4f46e5",
        },
      },
      boxShadow: {
        glass: "0 18px 45px rgba(15,23,42,0.65)",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};


