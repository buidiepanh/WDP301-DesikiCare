/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./slices/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "gray-theme": "#EAE5E2", // bạn đổi thành mã màu mong muốn
        "blue-theme": "#C4DAE6", // bạn đổi thành mã màu mong muốn
      },
      fontFamily: {
        sans: ["var(--font-instrument)", "sans-serif"],
        instrument: ["var(--font-instrument)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
