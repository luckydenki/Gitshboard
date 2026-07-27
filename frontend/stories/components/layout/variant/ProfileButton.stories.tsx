import type { Meta, StoryObj } from "@storybook/react-vite";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import ProfileButton from "../../../../app/components/layout/variant/ProfileButton";

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
  title: "Components/Layout/Variant/ProfileButton",
  component: ProfileButton,
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <Story />
      </QueryClientProvider>
    ),
  ],
} satisfies Meta<typeof ProfileButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
