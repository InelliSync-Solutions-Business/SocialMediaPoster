/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "hsl(var(--background))",
          card: "hsl(var(--light-card))", // New soft card background
          hover: "hsl(var(--light-card-hover))", // New soft hover background
          highlight: "hsl(var(--light-highlight))", // New soft highlight
        },
        foreground: {
          DEFAULT: "hsl(var(--foreground))",
          muted: "hsl(var(--light-muted))", // New muted text color
          accent: "hsl(var(--light-accent))", // New soft accent
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        border: "hsl(var(--border))",
      },
      borderRadius: {
        lg: "0.8rem",
        md: "0.6rem",
        sm: "0.4rem",
      },
      boxShadow: {
        'soft': '0 4px 12px rgba(0, 0, 0, 0.08)',
        'medium': '0 6px 16px rgba(0, 0, 0, 0.12)',
        'lifted': '0 10px 25px rgba(0, 0, 0, 0.15)',
        'lifted-md': '0 12px 30px rgba(0, 0, 0, 0.18)',
        'lifted-lg': '0 15px 40px rgba(0, 0, 0, 0.22)',
        'dark-lifted': '0 10px 25px rgba(0, 0, 0, 0.3)',
        'dark-lifted-md': '0 12px 30px rgba(0, 0, 0, 0.4)',
        'dark-lifted-lg': '0 15px 40px rgba(0, 0, 0, 0.5)'
      },
    },
  },
  plugins: [],
}
