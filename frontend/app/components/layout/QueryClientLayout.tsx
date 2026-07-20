import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Outlet, useNavigate } from "react-router";
import HeaderLayout from "./variant/HeaderLayout";





export default function QueryClientLayout() {

    const [queryClient] = useState(()=>new QueryClient()); //이렇게 하면 컴포넌트가 처음 렌더링 될 때 한 번만 생성되고 이후에는 같은 인스턴스를 사용합니다.
    const navigate = useNavigate();

    return(
        <QueryClientProvider client ={queryClient}>
            <HeaderLayout onClick={()=>{navigate("/")}}
                />
            <Outlet/>
        </QueryClientProvider>

    )
}