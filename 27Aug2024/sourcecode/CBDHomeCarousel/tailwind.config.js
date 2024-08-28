/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {

    extend: {
      screens: {
        'laptop': '1028px',
        'desktop': '1288px',
        'large': "1444px"
      },
      listStyleType: {
        square: 'square'
      },
      colors: {
        search: "#F0F3F3",
        gray1: "#353535",
        gray2: "#6A6A6A",
        gray3: "#9B9B9B",
        gray4: "#BDBDBD",
        gray5: "#E0E0E0",
        light: "#F0F3F3",
        primary: "#006E7D",
        secondary: "#12BCF1",
        accent: "#006583"

      },
      fontFamily: {
        cairo: ["Cairo", "sans-serif"],
      },
      padding: {
        140: '3.5rem',
        350: '12.5rem',
      },
      inset: {
        120: '1.5rem',
        140: '3.5rem',
        160: '4.5rem',
        240: '7rem',
        340: '10rem',
        350: '12.5rem',
        440: '24rem',
        1250: '250px',
        1200: '200px'
      },
      spacing: {
        120: '1.5rem',
        140: '3.5rem',
        160: '4.5rem',
        240: '7rem',
        340: '10rem',
        350: '12.5rem',
        440: '24rem',
        1250: '250px',
        1200: '200px'
      },
      maxWidth: {
        xlmax: '1680px',
        lgmax: '1400px',
        xlgmax: '1350px',
        xmdmax: '1150px',
        mdmax: '900px',
        smmax: '600px'
      },
      maxHeight: {
        xlmax: '1680px',
        lgmax: '1400px',
        xlgmax: '1350px',
        xmdmax: '1150px',
        mdmax: '900px',
        smmax: '600px'
      },

    },
  },
  plugins: [],
}

