import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter } from "react-router";

import HeaderLayout from "../../../../app/components/layout/variant/HeaderLayout";

const meta = {
  title: "Components/Layout/Variant/HeaderLayout",
  component: HeaderLayout,
  tags: ["!test"],
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
  args: {
    href: "/",
    children: <span className="text-sm text-gray-600">Header content</span>,
  },
} satisfies Meta<typeof HeaderLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
