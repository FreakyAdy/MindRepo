/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                base: '#1e1e2e',
                mantle: '#181825',
                crust: '#11111b',
                text: '#cdd6f4',
                subtext0: '#a6adc8',
                subtext1: '#bac2de',
                surface0: '#313244',
                surface1: '#45475a',
                overlay0: '#6c7086',
                blue: '#89b4fa',
                red: '#f38ba8',
                green: '#a6e3a1',
                yellow: '#f9e2af',
                mauve: '#cba6f7',
                peach: '#fab387',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
