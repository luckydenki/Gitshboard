import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    // Storybook에서 필요한 Vite 설정만 작성합니다.

    plugins: [
        tailwindcss(),
    ]
    
});