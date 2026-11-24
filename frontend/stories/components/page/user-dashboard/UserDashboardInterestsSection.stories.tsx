import type {Meta,StoryObj} from "@storybook/react-vite";
import {expect} from "storybook/test";
import UserDashboardInterestsSection from "../../../../app/routes/user-dashboard/UserDashboardInterestsSection";
const meta={title:"Components/Page/UserDashboard/InterestsSection",component:UserDashboardInterestsSection} satisfies Meta<typeof UserDashboardInterestsSection>;
export default meta;
type Story=StoryObj<typeof meta>;
// 공통 패널 4개와 기존 GitHub 링크 9개가 유지되는지 확인합니다.
export const Default:Story={play:async({canvas})=>{
 await expect(canvas.getAllByRole("heading",{level:3})).toHaveLength(4);
 const links=canvas.getAllByRole("link");await expect(links).toHaveLength(9);
 for(const link of links){await expect(link).toHaveAttribute("target","_blank");await expect(link).toHaveAttribute("rel","noreferrer");}
 await expect(canvas.getByText(/디자인을 위한 예시입니다/)).toBeVisible();
}};
// 좁은 화면의 관심사 패널을 점검하는 사례입니다.
export const Mobile:Story={globals:{viewport:{value:"mobile1",isRotated:false}}};

