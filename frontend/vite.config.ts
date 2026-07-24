import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// USE_VITE_PROXY=false npx vercel dev --listen 5173

export default defineConfig(() => {

  const useViteProxy = process.env.USE_VITE_PROXY !== "false";
  console.log(`USE_VITE_PROXY=${useViteProxy}`);

  return {
    plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
    server: {          
      host : "0.0.0.0",
      port : Number(process.env.PORT) || 5173,
      proxy : useViteProxy ? {
        "/api" : {
          target: "http://localhost:3000",
          changeOrigin :true
        }
      } : undefined
    }
  };
});
