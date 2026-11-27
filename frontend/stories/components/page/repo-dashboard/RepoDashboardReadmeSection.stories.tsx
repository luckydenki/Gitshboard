import type { ComponentType } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Route, Routes } from "react-router";
import { expect, userEvent } from "storybook/test";
import RepoDashboardReadmeSection from "../../../../app/routes/repo-dashboard/RepoDashboardReadmeSection";
import { QueryKeys } from "../../../../app/types/queryKey/query-key-enum";
import type {
    GetRepoReadmeContentDto,
    GetRepoReadmesDto,
} from "../../../../app/types/response/repo-readme";

const owner = "octocat";
const repo = "hello-world";
const firstPath = "README.md";
const secondPath = "packages/example/README.md";
const documents: GetRepoReadmesDto = {
    defaultBranch: "main",
    documents: [
        { path: firstPath, sha: "abc" },
        { path: secondPath, sha: "def" },
    ],
};
const content = (path: string, markdown: string): GetRepoReadmeContentDto => ({
    path,
    markdown,
    defaultBranch: "main",
    htmlUrl: `https://github.com/${owner}/${repo}/blob/main/${path}`,
});
const readme = content(
    firstPath,
    '# Example\n\n<div align="center"><img width="120" src="http://localhost:6006/Gitshboard_logo.png" alt="Logo" /></div>\n\n| Name | Value |\n| --- | --- |\n| status | ready |\n',
);
const nestedReadme = content(secondPath, "# Nested README\n\n[Guide](./guide.md)");

type Scenario = "default" | "empty" | "long" | "loading" | "listError" | "contentError";

function withScenario(scenario: Scenario) {
    return (Story: ComponentType) => {
        const client = new QueryClient({
            defaultOptions: {
                queries: {
                    retry: false,
                    retryOnMount: false,
                    refetchOnMount: false,
                    staleTime: Infinity,
                },
            },
        });
        const listKey = [QueryKeys.REPO_DASHBOARD_READMES, owner, repo];
        const contentKey = [QueryKeys.REPO_DASHBOARD_README_CONTENT, owner, repo, firstPath];
        if (scenario === "listError") {
            client
                .getQueryCache()
                .build(client, { queryKey: listKey })
                .setState({ status: "error", error: new Error("목록 조회 실패") });
        } else if (scenario === "loading") {
            void client.fetchQuery({
                queryKey: listKey,
                queryFn: () => new Promise<never>(() => {}),
            });
        } else {
            client.setQueryData(
                listKey,
                scenario === "empty"
                    ? { ...documents, documents: [] }
                    : scenario === "long"
                      ? {
                            ...documents,
                            documents: [
                                ...documents.documents,
                                {
                                    path: `packages/${"very-long-folder/".repeat(7)}README.md`,
                                    sha: "long",
                                },
                            ],
                        }
                      : documents,
            );
            if (scenario === "contentError") {
                client
                    .getQueryCache()
                    .build(client, { queryKey: contentKey })
                    .setState({ status: "error", error: new Error("본문 조회 실패") });
            } else {
                client.setQueryData(contentKey, readme);
                client.setQueryData(
                    [QueryKeys.REPO_DASHBOARD_README_CONTENT, owner, repo, secondPath],
                    nestedReadme,
                );
            }
        }
        return (
            <QueryClientProvider client={client}>
                <MemoryRouter initialEntries={[`/repo/${owner}/${repo}/readme`]}>
                    <Routes>
                        <Route
                            path="/repo/:owner/:repo/readme"
                            element={<Story />}
                        />
                    </Routes>
                </MemoryRouter>
            </QueryClientProvider>
        );
    };
}

const meta = {
    title: "Components/Page/RepoDashboard/ReadmeSection",
    component: RepoDashboardReadmeSection,
    parameters: { layout: "fullscreen" },
} satisfies Meta<typeof RepoDashboardReadmeSection>;
export default meta;
type Story = StoryObj<typeof meta>;

// HTML 이미지와 GFM 표가 있는 일반 README를 표시합니다.
export const Default: Story = {
    decorators: [withScenario("default")],
    play: async ({ canvas }) => {
        await expect(canvas.getByRole("heading", { name: "Example" })).toBeVisible();
        await expect(canvas.getByRole("img", { name: "Logo" })).toHaveAttribute(
            "src",
            "http://localhost:6006/Gitshboard_logo.png",
        );
        await expect(canvas.getByRole("table")).toBeVisible();
    },
};

// README를 선택하면 제목과 상대 링크 대상이 함께 바뀝니다.
export const SwitchDocument: Story = {
    decorators: [withScenario("default")],
    play: async ({ canvas }) => {
        await userEvent.click(canvas.getByRole("button", { name: secondPath }));
        await expect(canvas.getByRole("heading", { name: "Nested README" })).toBeVisible();
        await expect(canvas.getByRole("link", { name: "Guide" })).toHaveAttribute(
            "href",
            "https://github.com/octocat/hello-world/blob/main/packages/example/guide.md",
        );
    },
};

// 파일이 없는 저장소의 빈 상태입니다.
export const Empty: Story = { decorators: [withScenario("empty")] };
// 깊고 긴 경로가 있는 저장소의 경계 상태입니다.
export const LongPath: Story = { decorators: [withScenario("long")] };
// 목록 요청이 완료되지 않은 로딩 상태입니다.
export const Loading: Story = { decorators: [withScenario("loading")] };
// 목록 조회 실패와 재시도 버튼을 표시합니다.
export const ListError: Story = { decorators: [withScenario("listError")] };
// 본문 조회 실패와 재시도 버튼을 표시합니다.
export const ContentError: Story = { decorators: [withScenario("contentError")] };
// 작은 화면에서 파일 선택 메뉴를 표시합니다.
export const Mobile: Story = {
    decorators: [withScenario("default")],
    globals: { viewport: { value: "mobile1", isRotated: false } },
    play: async ({ canvas }) => {
        const select = canvas.getByRole("combobox", { name: /README 파일/ });
        await expect(select).toBeVisible();
        await userEvent.selectOptions(select, secondPath);
        await expect(canvas.getByRole("heading", { name: "Nested README" })).toBeVisible();
    },
};
