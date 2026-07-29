import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import SearchCategorySelect from "../../../../app/components/page/search/SearchCategorySelect";

const meta = {
  title: "Components/Page/Search/SearchCategorySelect",
  component: SearchCategorySelect,
  tags: ["!test"],
  parameters: {
    layout: "centered",
  },
  args: {
    setCategory: fn(),
  },
} satisfies Meta<typeof SearchCategorySelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
