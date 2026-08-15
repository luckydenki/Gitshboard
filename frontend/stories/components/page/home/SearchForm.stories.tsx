import type { Meta, StoryObj } from "@storybook/react-vite";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { MemoryRouter, useLocation } from "react-router";
import { expect, fn, userEvent } from "storybook/test";

import SearchForm from "../../../../app/components/page/home/SearchForm";

const autocompleteResponse = {
  total_count: 1,
  incomplete_results: false,
  items: [
    {
      login: "octocat",
      id: 1,
      avatar_url:
        "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==",
      html_url: "https://github.com/octocat",
      type: "User",
    },
  ],
};

const mockAutocompleteRequest = () => {
  const originalFetch = globalThis.fetch;

  globalThis.fetch = fn(async () => ({
    ok: true,
    status: 200,
    json: async () => autocompleteResponse,
  })) as unknown as typeof fetch;

  return () => {
    globalThis.fetch = originalFetch;
  };
};

const LocationDisplay = () => {
  const location = useLocation();

  return (
    <output data-testid="search-location" hidden>
      {location.pathname}
      {location.search}
    </output>
  );
};

const SearchFormStoryProviders = ({ children }: { children: ReactNode }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        {children}
        <LocationDisplay />
      </MemoryRouter>
    </QueryClientProvider>
  );
};

const meta = {
  title: "Components/Page/Home/SearchForm",
  component: SearchForm,
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <SearchFormStoryProviders>
        <Story />
      </SearchFormStoryProviders>
    ),
  ],
} satisfies Meta<typeof SearchForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const 필요_UI요소_확인: Story = {
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("textbox", {
        name: "Search for github users input field",
      }),
    ).toBeInTheDocument();
    await expect(
      canvas.getByRole("button", { name: "Search users" }),
    ).toBeInTheDocument();
  },
};

export const 자동_완성_결과: Story = {
  beforeEach: mockAutocompleteRequest,
  play: async ({ canvas }) => {
    const input = canvas.getByRole("textbox", {
      name: "Search for github users input field",
    });

    await userEvent.type(input, "octocat");

    await expect(
      await canvas.findByText("octocat", {}, { timeout: 2_500 }),
    ).toBeVisible();
  },
};

export const 제출_시_이동: Story = {
  play: async ({ canvas }) => {
    const input = canvas.getByRole("textbox", {
      name: "Search for github users input field",
    });

    await userEvent.type(input, "octocat");
    await userEvent.click(
      canvas.getByRole("button", { name: "Search users" }),
    );

    await expect(canvas.getByTestId("search-location")).toHaveTextContent(
      "/search?name=octocat",
    );
  },
};

export const 키보드_포커스_지원: Story = {
  play: async ({ canvas }) => {
    const input = canvas.getByRole("textbox", {
      name: "Search for github users input field",
    });
    const submitButton = canvas.getByRole("button", {
      name: "Search users",
    });

    document.body.focus();
    await userEvent.tab();
    await expect(input).toHaveFocus();
    await userEvent.tab();
    await expect(submitButton).toHaveFocus();
  },
};
