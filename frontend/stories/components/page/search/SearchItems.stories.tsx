import type { Meta, StoryObj } from "@storybook/react-vite";

import { SearchItems } from "../../../../app/components/page/search/SearchItems";

const meta = {
  title: "Components/Page/Search/SearchItems",
  component: SearchItems,
  parameters: {
    layout: "centered",
  },
  args: {
    user: {
      login: "octocat",
      id: 1,
      avatar_url: "https://github.com/octocat.png",
      html_url: "https://github.com/octocat",
      type: "User",
    },
  },
} satisfies Meta<typeof SearchItems>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
