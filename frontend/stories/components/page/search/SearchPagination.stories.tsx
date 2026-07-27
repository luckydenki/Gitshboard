import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter } from "react-router";

import SearchPagination from "../../../../app/components/page/search/SearchPagination";

const meta = {
  title: "Components/Page/Search/SearchPagination",
  component: SearchPagination,
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
  args: {
    name: "octocat",
    page: "1",
    data: { total_count: 100 },
    children: <span className="px-4">1</span>,
  },
} satisfies Meta<typeof SearchPagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
