import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter } from "react-router";

import SearchHeader from "../../../../app/components/layout/variant/SearchHeader";

const meta = {
  title: "Components/Layout/Variant/SearchHeader",
  component: SearchHeader,
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
} satisfies Meta<typeof SearchHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
