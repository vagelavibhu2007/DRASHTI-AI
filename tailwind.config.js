/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          950: '#070F1E',
          900: '#0B1728',
          850: '#102038',
          800: '#162A47',
          700: '#1E3A5F',
          600: '#254E7E',
          500: '#2F66A5',
          400: '#4884C6',
          300: '#7BA8DE',
          200: '#B8D1F1',
          100: '#E1EDFB',
          50: '#F0F6FD'
        },
        risk: {
          low: {
            DEFAULT: '#10B981',
            light: '#ECFDF5',
            border: '#A7F3D0',
            text: '#065F46',
            dark: '#047857'
          },
          medium: {
            DEFAULT: '#F59E0B',
            light: '#FFFBEB',
            border: '#FDE68A',
            text: '#92400E',
            dark: '#D97706'
          },
          high: {
            DEFAULT: '#F97316',
            light: '#FFF7ED',
            border: '#FFEDD5',
            text: '#9A3412',
            dark: '#C2410C'
          },
          critical: {
            DEFAULT: '#EF4444',
            light: '#FEF2F2',
            border: '#FECACA',
            text: '#991B1B',
            dark: '#DC2626'
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace']
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(15, 23, 42, 0.05), 0 1px 2px -1px rgba(15, 23, 42, 0.05)',
        'card-hover': '0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.04)',
        'gov': '0 4px 20px -2px rgba(11, 23, 40, 0.15)'
      }
    },
  },
  plugins: [],
}

