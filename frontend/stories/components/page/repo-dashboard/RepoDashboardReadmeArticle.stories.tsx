import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import RepoDashboardReadmeArticle from "../../../../app/components/page/repo-dashboard/RepoDashboardReadmeArticle";

const baseContent = {
    path: "README.md",
    defaultBranch: "main",
    htmlUrl: "https://github.com/octocat/hello-world/blob/main/README.md",
    markdown: '# Example\n\n<div align="center"><img src="http://localhost:6006/Gitshboard_logo.png" alt="Logo" width="120" /></div>\n\n[Guide](./guide.md)\n\n| Name | Value |\n| --- | --- |\n| status | ready |',
};

const meta = { title: "Components/Page/RepoDashboard/ReadmeArticle", component: RepoDashboardReadmeArticle, args: { content: baseContent } } satisfies Meta<typeof RepoDashboardReadmeArticle>;
export default meta;
type Story = StoryObj<typeof meta>;

// HTML 이미지, 상대 링크, GFM 표를 렌더링합니다.
export const Default: Story = { play: async ({ canvas }) => {
    await expect(canvas.getByRole("img", { name: "Logo" })).toBeVisible();
    await expect(canvas.getByRole("link", { name: "Guide" })).toHaveAttribute("href", "https://github.com/octocat/hello-world/blob/main/guide.md");
    await expect(canvas.getByRole("table")).toBeVisible();
} };

// 저장소 HTML의 위험한 요소를 제거하고 대체 이미지 이름을 제공합니다.
export const UnsafeHtml: Story = { args: { content: { ...baseContent, markdown: '<iframe src="https://example.com"></iframe>\n\n<img src="http://localhost:6006/Gitshboard_logo.png" onerror="alert(1)" />' } }, play: async ({ canvas, canvasElement }) => {
    await expect(canvasElement.querySelector("iframe")).not.toBeInTheDocument();
    await expect(canvas.getByRole("img", { name: "README 이미지" })).not.toHaveAttribute("onerror");
} };

// 긴 코드 줄과 넓은 표는 본문 영역 안에서 스크롤됩니다.
export const WideContent: Story = { args: { content: { ...baseContent, markdown: `# Wide content\n\n\`\`\`text\n${"long-line-".repeat(50)}\n\`\`\`\n\n| ${"column".repeat(20)} | value |\n| --- | --- |\n| data | ready |` } } };

// 좁은 화면에서 본문과 이미지를 표시합니다.
export const Mobile: Story = { parameters: { viewport: { defaultViewport: "mobile1" } } };
