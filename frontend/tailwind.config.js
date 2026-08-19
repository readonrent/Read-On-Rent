/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#0B1F3A",
          light: "#132B4D",
        },
        orange: {
          DEFAULT: "#FF7A29",
          light: "#FF9A5C",
        },
        cream: "#FFF8EF",
        softblue: "#EAF2FB",
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
      boxShadow: {
        card: "0 8px 24px rgba(11,31,58,0.08)",
      },
      keyframes: {
        floatY: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        floatY: "floatY 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

