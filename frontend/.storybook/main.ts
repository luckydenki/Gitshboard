//main.ts는 어떤 story 파일을 읽고 애드온을 사용할지 설정하는 파일이다.
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  "stories": [
    "../stories/**/*.mdx",
    "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@chromatic-com/storybook",
    "@storybook/addon-vitest",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@storybook/addon-mcp"
  ],
  "framework": "@storybook/react-vite",

  core : {
    builder : {
      name : "@storybook/builder-vite",
      options : {
        viteConfigPath : "../frontend/vite.storybook.config.ts"  //별도의 vite 환경 설정
      }
    }
  }
};
export default config;