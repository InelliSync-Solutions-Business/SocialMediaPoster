/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 2s linear infinite',
      },
      boxShadow: {
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'medium': '0 6px 16px rgba(0, 0, 0, 0.12)',
        'lifted': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'lifted-md': '0 12px 30px rgba(0, 0, 0, 0.18)',
        'lifted-lg': '0 15px 40px rgba(0, 0, 0, 0.22)',
        'dark-lifted': '0 10px 25px rgba(0, 0, 0, 0.3)',
        'dark-lifted-md': '0 12px 30px rgba(0, 0, 0, 0.4)',
        'dark-lifted-lg': '0 15px 40px rgba(0, 0, 0, 0.5)'
      },
      borderRadius: {
        lg: "0.8rem",
        md: "0.6rem",
        sm: "0.4rem",
      },
      colors: {
        background: {
          DEFAULT: "hsl(var(--background))",
          card: "hsl(var(--light-card))", // New soft card background
          hover: "hsl(var(--light-card-hover))", // New soft hover background
          highlight: "hsl(var(--light-highlight))", // New soft highlight
          dark: '#020617',
        },
        foreground: {
          DEFAULT: "hsl(var(--foreground))",
          muted: "hsl(var(--light-muted))", // New muted text color
          accent: "hsl(var(--light-accent))", // New soft accent
          dark: '#ffffff',
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
    },
  },
  plugins: [],
}
