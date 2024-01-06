/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        dark: '#121212',
        primary: '#8A2BE2',
        darklight: '#1E1E1E',
        atlantis: "#83e22b",
        persian: "#2e2be2",
        shockingpink: "#e22bdf",
        cerise: "#E22B83",
        zest: "#E28A2B",
      }
    },
  },
  plugins: [require('@vidstack/react/tailwind.cjs')],
}
