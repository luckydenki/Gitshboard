import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Outlet } from "react-router";
import HeaderLayout from "./HeaderLayout";





export default function QueryClientLayout() {

    const [queryClient] = useState(()=>new QueryClient()); //이렇게 하면 컴포넌트가 처음 렌더링 될 때 한 번만 생성되고 이후에는 같은 인스턴스를 사용합니다.

    return(
        <QueryClientProvider client ={queryClient}>
            <HeaderLayout/>
            <Outlet/>
           
        </QueryClientProvider>

    )
}