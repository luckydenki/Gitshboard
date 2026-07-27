import { createElement } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router';

import SearchForm from '../app/components/page/home/SearchForm';

//meta 데이터입니다.
const meta = {
  title: 'Components/SearchForm',
  component: SearchForm,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => createElement(MemoryRouter, null, createElement(Story)),
  ],
  args: {},
} satisfies Meta<typeof SearchForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
