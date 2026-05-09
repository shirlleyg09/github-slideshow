import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        pulsari: { cyan: "#00E0FF", navy: "#06111F", ink: "#0B1020", purple: "#7C3AED", pink: "#EC4899" }
      },
      fontFamily: { sans: ["Inter", "system-ui", "sans-serif"] },
      boxShadow: { glow: "0 0 35px rgba(0, 224, 255, .22)" }
    }
  },
  plugins: []
};
export default config;
