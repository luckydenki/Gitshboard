import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent } from "storybook/test";

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

export const Default: Story = {
  play: async ({ canvas }) => {
    const accountLink = canvas.getByRole("link", { name: /octocat/i });

    await expect(canvas.getByRole("img", { name: "octocat's avatar" })).toBeVisible();
    await expect(canvas.getByText("octocat")).toBeVisible();
    await expect(canvas.getByText("User")).toBeVisible();
    await expect(accountLink).toHaveAttribute("href", "https://github.com/octocat");
    await expect(accountLink).toHaveAttribute("target", "_blank");
    await expect(accountLink).toHaveAttribute("rel", "noopener noreferrer");

    await userEvent.hover(accountLink);
    await expect(accountLink.firstElementChild).toHaveClass("hover:bg-gray-100");

    await userEvent.tab();
    await expect(accountLink).toHaveFocus();
  },
};

export const Organization: Story = {
  args: {
    user: {
      login: "github",
      id: 2,
      avatar_url: "https://github.com/github.png",
      html_url: "https://github.com/github",
      type: "Organization",
    },
  },
  play: async ({ canvas }) => {
    const accountLink = canvas.getByRole("link", { name: /github/i });

    await expect(canvas.getByRole("img", { name: "github's avatar" })).toBeVisible();
    await expect(canvas.getByText("github")).toBeVisible();
    await expect(canvas.getByText("Organization")).toBeVisible();
    await expect(accountLink).toHaveAttribute("href", "https://github.com/github");
  },
};
