import type { Meta, StoryObj } from "@storybook/react-vite";

import HomeClickButton from "../../../../app/components/page/home/HomeClickButton";

const meta = {
  title: "Components/Page/Home/HomeClickButton",
  component: HomeClickButton,
  tags: ["!test"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof HomeClickButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
