/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'var(--font-poppins)', 'system-ui', 'sans-serif'],
        display: ['var(--font-poppins)', 'var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-primary": "linear-gradient(135deg, #00D4FF 0%, #4A90E2 100%)",
      },
      colors: {
        accent: {
          primary: "#00D4FF",
          secondary: "#4A90E2",
        },
      },
      boxShadow: {
        'glow': '0 0 30px rgba(0, 212, 255, 0.2)',
        'glow-lg': '0 0 60px rgba(0, 212, 255, 0.3)',
      },
      animation: {
        'orb-float': 'orb-float 8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
  darkMode: "class",
};
