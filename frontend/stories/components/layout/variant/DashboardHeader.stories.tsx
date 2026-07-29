import type { Meta, StoryObj } from "@storybook/react-vite";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";

import DashboardHeader from "../../../../app/components/layout/variant/DashboardHeader";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: Number.POSITIVE_INFINITY,
    },
  },
});

queryClient.setQueryData(["headerUserData"], {
  login: "octocat",
  avatarUrl: "https://github.com/octocat.png",
});

const meta = {
  title: "Components/Layout/Variant/DashboardHeader",
  component: DashboardHeader,
  tags: ["!test"],
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <Story />
        </MemoryRouter>
      </QueryClientProvider>
    ),
  ],
} satisfies Meta<typeof DashboardHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
