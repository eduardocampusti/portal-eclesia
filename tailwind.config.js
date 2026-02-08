import tailwindAnimate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                green: {
                    DEFAULT: '#27432F',
                    dark: '#1a2d1f',
                },
                orange: {
                    DEFAULT: '#D19E65',
                    light: '#fdfaf7',
                },
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                serif: ['Playfair Display', 'serif'],
            },
            borderRadius: {
                'xl': '16px',
                '2xl': '22px',
                '3xl': '32px',
                '4xl': '40px',
            },
            animation: {
                "fade-in": "fade-in 0.5s ease-out",
                "slide-in-from-bottom": "slide-in-from-bottom 0.5s ease-out",
            },
        },
    },
    plugins: [
        tailwindAnimate,
    ],
}
