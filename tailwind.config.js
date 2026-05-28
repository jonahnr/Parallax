export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        parallax: {
          navy: "#0B1745",
          deep: "#071033",
          blue: "#1F6AE5",
          teal: "#16B5A3",
          gold: "#F5B544",
          muted: "#AEBCE0"
        }
      },
      boxShadow: {
        glow: "0 0 32px rgba(31, 106, 229, 0.22)",
        gold: "0 0 28px rgba(245, 181, 68, 0.18)"
      },
      keyframes: {
        softPulse: {
          "0%, 100%": { opacity: "0.68", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.08)" }
        },
        chartDraw: {
          from: { strokeDashoffset: "360" },
          to: { strokeDashoffset: "0" }
        }
      },
      animation: {
        softPulse: "softPulse 2.6s ease-in-out infinite",
        chartDraw: "chartDraw 800ms ease-out both"
      }
    }
  },
  plugins: []
};
