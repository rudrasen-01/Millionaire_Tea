/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'vendor': {
          50: '#FFF5E6',
          100: '#FFE4CC',
          200: '#FFD4B3',
          300: '#FFC399',
          400: '#FFB380',
          500: '#FF9933',
          600: '#FF8C00',
          700: '#FF7F00',
          800: '#FF6B35',
          900: '#E55100',
        },
        'orange': {
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#F97316',
          600: '#EA580C',
          700: '#C2410C',
          800: '#9A3412',
          900: '#7C2D12',
        },
        'luxury': {
          'gold': '#FFD700',
          'bronze': '#CD7F32',
          'platinum': '#E5E4E2',
        },
        'beige': '#D8B08C',
        'caramel': '#B87333',
        'darkBrown': '#4A2C2A',
        'cream': '#F5E6D3',
        'warmWhite': '#FDF8F3',
      },
      fontFamily: {
        'inter': ['Inter', 'ui-sans-serif', 'system-ui'],
        'luxury': ['Playfair Display', 'Georgia', 'serif'],
        'baloo': ['Baloo 2', 'cursive'],
        'quicksand': ['Quicksand', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
        xl: '24px',
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'scale-in': 'scaleIn 0.6s ease-out',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 3s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        }
      },
      boxShadow: {
        'luxury': '0 25px 50px -12px rgba(255, 153, 51, 0.25)',
        'glow': '0 0 20px rgba(255, 153, 51, 0.3)',
        'inner-glow': 'inset 0 0 20px rgba(255, 153, 51, 0.1)',
      }
    },
  },
  plugins: [],
}

