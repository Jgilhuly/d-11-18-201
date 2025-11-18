/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        'crimson': ['Crimson Text', 'serif'],
        'dm-sans': ['DM Sans', 'sans-serif'],
        'roboto-mono': ['Roboto Mono', 'monospace'],
      },
      fontSize: {
        'display': ['160px', { lineHeight: '0.9', letterSpacing: '-6.8px' }],
        'heading-1': ['60px', { lineHeight: '0.9', letterSpacing: '-1.8px' }],
        'heading-2': ['40px', { lineHeight: '1', letterSpacing: '-1.6px' }],
        'heading-3': ['18px', { lineHeight: '1', letterSpacing: '-0.54px' }],
        'paragraph': ['15px', { lineHeight: '1.4', letterSpacing: '-0.075px' }],
        'link': ['14px', { lineHeight: '1.4', letterSpacing: '-0.35px' }],
        'captions': ['12px', { lineHeight: '1.4', letterSpacing: '-0.12px' }],
        'display-stats': ['80px', { lineHeight: '1', letterSpacing: '-3.2px' }],
      },
      borderRadius: {
        'figma': '30px',
        'figma-sm': '20px',
        'figma-lg': '1000px',
      },
      spacing: {
        'figma-xs': '2.5px',
        'figma-sm': '5px',
        'figma-md': '10px',
        'figma-lg': '20px',
        'figma-xl': '30px',
        'figma-2xl': '50px',
        'figma-3xl': '60px',
        'figma-4xl': '120px',
      },
    },
  },
};

export default config;
