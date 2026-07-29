import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ComponentProps } from "react";
import { MemoryRouter, useLocation } from "react-router";
import { expect, userEvent } from "storybook/test";

import SearchPagination from "../../../../app/components/page/search/SearchPagination";
import { useSearchPagination } from "../../../../app/hooks/pages/search-hooks";

function LocationDisplay() {
  const location = useLocation();

  return <output aria-label="현재 검색 주소">{location.search}</output>;
}

function SearchPaginationWithPageButtons({
  name,
  page,
  data,
}: ComponentProps<typeof SearchPagination>) {
  const { PaginationButton } = useSearchPagination({
    data,
    page,
    per_page: { current: 10 },
    name,
    PageButton: ({ pageNumber, isActive, onClick }) => (
      <button className={`w-12 h-12
            ${isActive ? "bg-gray-300" : "bg-white"}
            text-center
            not-disabled:hover:bg-gray-400
            not-sm:text-xs not-sm:w-8 not-sm:h-8
            `}
            onClick={onClick}
            disabled={isActive}
            aria-current={isActive ? "page" : undefined}
            >
            {pageNumber}
        </button>
    ),
  });

  return (
    <SearchPagination name={name} page={page} data={data}>
      {PaginationButton}
    </SearchPagination>
  );
}

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
        <LocationDisplay />
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

export const Default: Story = {
  name: "기본 페이지 이동",
  play: async ({ canvas }) => {
    const previousButton = canvas.getByRole("button", { name: "<" });
    const nextButton = canvas.getByRole("button", { name: ">" });
    const location = canvas.getByLabelText("현재 검색 주소");

    await expect(canvas.getByText("1")).toBeVisible();
    await expect(previousButton).toBeVisible();
    await expect(nextButton).toBeVisible();

    await userEvent.tab();
    await expect(previousButton).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await expect(location).toHaveTextContent("?name=octocat&page=1");

    await userEvent.tab();
    await expect(nextButton).toHaveFocus();
    await userEvent.hover(nextButton);
    await expect(nextButton).toHaveClass("hover:bg-gray-400");
    await userEvent.keyboard("{Enter}");
    await expect(location).toHaveTextContent("?name=octocat&page=11");
  },
};

export const PreviousPage: Story = {
  name: "이전 페이지 이동",
  args: {
    page: "11",
    children: <span className="px-4">11</span>,
  },
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "<" }));

    await expect(canvas.getByLabelText("현재 검색 주소")).toHaveTextContent(
      "?name=octocat&page=1",
    );
  },
};

export const LastPage: Story = {
  name: "마지막 페이지 제한",
  args: {
    page: "100",
    children: <span className="px-4">100</span>,
  },
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: ">" }));

    await expect(canvas.getByLabelText("현재 검색 주소")).toHaveTextContent(
      "?name=octocat&page=100",
    );
  },
};

export const HookPageButtons: Story = {
  name: "페이지 버튼 자식 렌더링",
  render: (args) => <SearchPaginationWithPageButtons {...args} />,
  play: async ({ canvas }) => {
    const pageButtons = canvas.getAllByRole("button", { name: /^\d+$/ });

    await expect(pageButtons).toHaveLength(10);
    await expect(canvas.getByRole("button", { name: "1" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    await expect(canvas.getByRole("button", { name: "10" })).toBeVisible();

    await userEvent.click(canvas.getByRole("button", { name: "5" }));
    await expect(canvas.getByLabelText("현재 검색 주소")).toHaveTextContent(
      "?name=octocat&page=5",
    );
  },
};
