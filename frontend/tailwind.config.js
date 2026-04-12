/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        sidebar: '#152033',
        'sidebar-hover': '#1e3a5f',
        accent:          '#2563eb',
        'sgd-blue':      '#1e3a8a',
      }
    },
  },
  plugins: [],
}

