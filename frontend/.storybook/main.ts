import type { StorybookConfig } from "@storybook/react-vite";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { mergeConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const dirname = path.dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  stories: [
    "../stories/**/*.mdx",
    "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  addons: [
    "@chromatic-com/storybook",
    "@storybook/addon-vitest",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@storybook/addon-mcp",
  ],
  framework: "@storybook/react-vite",
  core: {
    builder: {
      name: "@storybook/builder-vite",
      options: {
        viteConfigPath: path.resolve(dirname, "../vite.storybook.config.ts"),
      },
    },
  },
  // Vitest Storybook 프로젝트도 Storybook과 같은 Vite 플러그인을 적용한다.
  viteFinal: async (config) => mergeConfig(config, {
    plugins: [tailwindcss(), tsconfigPaths()],
    resolve: {
      alias: {
        "~": path.resolve(dirname, "../app"),
      },
    },
  }),
};

export default config;
