/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                accent: "var(--accent-color)",
            },
            fontFamily: {
                sans: ["Inter", "sans-serif"],
                heading: ["Orbitron", "sans-serif"],
            }
        },
    },
    plugins: [],
}
