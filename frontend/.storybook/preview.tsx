//모든 Story에 적용할 전역 CSS, 테마, Provider 등을 설정함.
//Storybook은 이 파일을 전역 렌더링 설정에 사용하는 것을 공식적으로 안내함.
import type { Preview } from '@storybook/react-vite'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    }
  },
};

export default preview;