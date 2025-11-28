/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],

  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: { DEFAULT: '#4F46E5', light: '#6366F1', dark: '#4338CA' },
        secondary: { DEFAULT: '#9333EA', light: '#A855F7', dark: '#7E22CE' },
      },
      boxShadow: {
        soft: '0 2px 10px rgba(0,0,0,0.06)',
        glow: '0 0 10px rgba(79,70,229,0.3)',
      },
      animation: {
        fadeIn: 'fadeIn 0.4s ease-in-out',
        pop: 'pop 0.3s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(8px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        pop: {
          '0%': { transform: 'scale(0.95)', opacity: 0 },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
      },
    },
  },

  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}

