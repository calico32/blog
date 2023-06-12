const sansFontStack = [
  'var(--wix-madefor-text)',
  'var(--noto-sans-jp)',
  'apple-system',
  'BlinkMacSystemFont',
  'Segoe UI',
  'Roboto',
  'Helvetica Neue',
  'Arial',
  'Noto Sans',
  'sans-serif',
  'Apple Color Emoji',
  'Segoe UI Emoji',
  'Segoe UI Symbol',
  'Noto Color Emoji',
]

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './lib/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './styles/**/*.{css,scss,sass}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: sansFontStack,
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
