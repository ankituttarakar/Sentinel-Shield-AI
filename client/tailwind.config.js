/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom professional slate palette
        slate: {
          950: '#020617',
          900: '#0f172a',
          800: '#1e293b',
          700: '#334155',
        },
        blue: {
          500: '#3b82f6',
          400: '#60a5fa',
        }
      },
      // Customizing the Typography (Prose) plugin
      typography: ({ theme }) => ({
        blue: {
          css: {
            '--tw-prose-invert-bullets': theme('colors.blue.500'),
            '--tw-prose-invert-links': theme('colors.blue.400'),
          },
        },
      }),
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    // This plugin helps with the "animate-in" classes used in the components
    require('tailwindcss-animate'),
  ],
}