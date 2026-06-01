import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Bảng màu chủ đạo — neutral tối giản
        // 1A1A1A đen chủ đạo · 3D3D3D xám đậm · 888780 xám trung
        // D3D1C7 xám nhạt · F8F6F2 kem trắng
        ink: {
          50: '#F8F6F2',
          100: '#D3D1C7',
          200: '#BCBAB1',
          300: '#A8A6A0',
          400: '#9A9892',
          500: '#888780',
          600: '#3D3D3D',
          700: '#2A2A2A',
          800: '#1A1A1A',
          900: '#0F0F0F',
        },
        cream: '#F8F6F2',
        stone: {
          light: '#D3D1C7',
          mid: '#888780',
          dark: '#3D3D3D',
        },

        // Giữ tên token cũ để các component hiện có vẫn build được,
        // nhưng remap sang palette neutral mới.
        primary: {
          50: '#F8F6F2',
          100: '#D3D1C7',
          200: '#BCBAB1',
          300: '#9A9892',
          400: '#888780',
          500: '#3D3D3D',
          600: '#1A1A1A',
          700: '#0F0F0F',
        },
        secondary: {
          50: '#F8F6F2',
          100: '#D3D1C7',
          200: '#BCBAB1',
          300: '#A8A6A0',
          400: '#9A9892',
          500: '#888780',
          600: '#3D3D3D',
          700: '#2A2A2A',
        },
        'spa-rose': '#D3D1C7',
        'spa-gold': '#888780',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
}

export default config
