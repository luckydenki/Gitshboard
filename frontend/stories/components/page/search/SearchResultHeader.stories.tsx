import type { Meta, StoryObj } from "@storybook/react-vite";
import SearchResultHeader from "../../../../app/components/page/search/SearchResultHeader";

const meta = { title: "Components/Page/Search/SearchResultHeader", component: SearchResultHeader, args: { total_count: 42 } } satisfies Meta<typeof SearchResultHeader>;
export default meta;
type Story = StoryObj<typeof meta>;
// 일반 검색 결과 건수입니다.
export const Default: Story = {};
// 결과가 없는 경계값입니다.
export const Empty: Story = { args: { total_count: 0 } };
// 큰 결과 건수를 표시합니다.
export const LargeCount: Story = { args: { total_count: 1000000 } };
