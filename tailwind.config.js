/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#060912",
          900: "#0B1120",
          800: "#0E1524",
          700: "#141D31",
          600: "#1B2540",
        },
      },
      boxShadow: {
        panel: "inset 0 1px 0 0 rgba(255,255,255,.05), 0 18px 40px -24px rgba(0,0,0,.9)",
        glow: "0 10px 30px -12px rgba(124,92,255,.85)",
      },
      keyframes: {
        rise: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "none" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        rise: "rise .45s cubic-bezier(.22,1,.36,1) both",
        shimmer: "shimmer 1.6s linear infinite",
      },
    },
  },
  plugins: [],
}
