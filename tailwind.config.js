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
                    DEFAULT: '#1F4D35',
                    dark: '#153526',
                },
                orange: {
                    DEFAULT: '#D29E65',
                    light: '#F9F3EC',
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
