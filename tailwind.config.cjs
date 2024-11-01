/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}', ' "./node_modules/flowbite/**/*.js"'],
  darkMode: 'selector',
  theme: {
    extend: {
      width: {
        'smallest-full': '100svw'
      },
      height: {
        'smallest-full': '100svh'
      },
      colors: {
        'dark-primary-darker': 'rgb(6 68 81)',
        'dark-primary-medium': '#086375',
        'bubble-bot': '#013f4e',
        'bubble-user': '#0089ad'
      }
    }
  },
  plugins: [require('flowbite/plugin')]
}
