import type { Meta, StoryObj } from "@storybook/react-vite";
import {useState} from "react";
import {expect,fn,userEvent} from "storybook/test";
import UserDashboardDevelopStyleQueryState from "../../../../app/components/page/user-dashboard/UserDashboardDevelopStyleQueryState";

const meta={title:"Components/Page/UserDashboard/DevelopStyleQueryState",component:UserDashboardDevelopStyleQueryState,args:{state:"loading",onRetry:fn()}} satisfies Meta<typeof UserDashboardDevelopStyleQueryState>;
export default meta;
type Story=StoryObj<typeof meta>;
// 5개 조회 패널의 로딩과 미구현 패널의 업데이트 안내를 유지합니다.
export const Loading:Story={play:async({canvas})=>{await expect(canvas.getAllByRole("status")).toHaveLength(5);await expect(canvas.getAllByRole("heading",{level:3})).toHaveLength(6);}};
// 각 패널의 재시도 버튼이 같은 조회 콜백에 연결되는지 확인합니다.
export const Error:Story={args:{state:"error"},play:async({canvas,args})=>{const buttons=canvas.getAllByRole("button",{name:"다시 시도"});await expect(buttons).toHaveLength(5);for(const button of buttons) await userEvent.click(button);await expect(args.onRetry).toHaveBeenCalledTimes(5);}};
// 재요청 중에는 오류 버튼을 없애고 모든 패널에 진행 상태를 표시합니다.
export const Retry:Story={args:{state:"error"},render:function RetryState(args){const [state,setState]=useState(args.state);return <UserDashboardDevelopStyleQueryState {...args} state={state} onRetry={()=>{args.onRetry();setState("loading");}}/>;},play:async({canvas})=>{await userEvent.click(canvas.getAllByRole("button",{name:"다시 시도"})[0]);await expect(canvas.getAllByRole("status")).toHaveLength(5);await expect(canvas.queryByRole("button")).not.toBeInTheDocument();}};
// 작은 화면에서 1열 배치와 오류 안내 줄바꿈을 검증합니다.
export const MobileError:Story={args:{state:"error"},decorators:[(Story)=><div style={{width:320,maxWidth:"100%"}}><Story/></div>]};

