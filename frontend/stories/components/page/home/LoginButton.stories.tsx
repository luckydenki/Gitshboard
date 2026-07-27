import type { Meta, StoryObj } from "@storybook/react-vite";

import LoginButton from "../../../../app/components/page/home/LoginButton";

const meta = {
  title: "Components/Page/Home/LoginButton",
  component: LoginButton,
  parameters: {
    layout: "centered",
  },
  args: {
    ID: "storybook-client-id",
    URL: "http://localhost:6006/auth/callback",
    mode: "Normal",
  },
} satisfies Meta<typeof LoginButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
