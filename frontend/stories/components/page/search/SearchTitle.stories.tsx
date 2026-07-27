import type { Meta, StoryObj } from "@storybook/react-vite";

import SearchTitle from "../../../../app/components/page/search/SearchTitle";

const meta = {
  title: "Components/Page/Search/SearchTitle",
  component: SearchTitle,
  parameters: {
    layout: "centered",
  },
  args: {
    name: "octocat",
  },
} satisfies Meta<typeof SearchTitle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
