/** @type {import('tailwindcss').Config} */
import flowbite from 'flowbite/plugin'
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}', './node_modules/flowbite/**/*.js'],
  theme: {
    extend: {
      colors: {
        'dark-primary-darker': 'rgb(6 68 81)',
        'dark-primary-medium': '#086375',
        'bubble-bot': '#106EAF',
        'bubble-user': '#F9E883'
      }
    }
  },
  plugin: [flowbite]
}
