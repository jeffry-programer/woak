import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
    base: '',  // <-- importante, para rutas relativas
    plugins: [
        laravel({
            input: ["resources/css/app.css", "resources/js/app.jsx"],
            refresh: false,
        }),
        tailwindcss({
            darkMode: true,
        }),
        react(),
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./resources/js"),
        },
    },
});
