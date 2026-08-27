import { QueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { commonRetry } from "~/utils/tanstack-utils";



/**
 * 
 * 프로젝트 전용 QueryClient를 생성하는 훅입니다.
 * 
 * @returns 
 * 
 */
export default function useProjectQueryClient(){

    const [queryClient] = useState(()=>new QueryClient({
      defaultOptions : {
        queries : {
          staleTime : 1 * 60 * 1000, //1분
          retry : commonRetry
        },
        mutations : {
          retry : commonRetry
        }
      },
    })); //이렇게 하면 컴포넌트가 처음 렌더링 될 때 한 번만 생성되고 이후에는 같은 인스턴스를 사용합니다.
    

  
  return queryClient;
}