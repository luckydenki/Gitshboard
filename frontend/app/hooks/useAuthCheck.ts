import { useQuery } from "@tanstack/react-query";
import type { CommonErrorResponse, CommonResponse } from "~/types/common/common";
import { commonRetry } from "~/utils/tanstackUtil";






/**
 * 인증 상태인지 확인하는 훅입니다.
 * 
 * 
 * @returns { data: CommonResponse<string> | undefined, isLoading: boolean, isError: boolean }
 */
export default function useAuthCheck(keyword?: string){

    const { data, isLoading, isError, error} = useQuery<CommonResponse<string>, CommonErrorResponse>({
      queryKey : ['auth_check', keyword],
      queryFn : async()=>{
        try{
          const res = await fetch(`/api/auth/check`,{
            method : 'GET',
            credentials : 'include'
          })

          if(res.ok){
            const data : CommonResponse<string> = await res.json();
            return data;
          }
          else{
            const errorData : CommonErrorResponse = await res.json();
            console.log("errorData", errorData);
            throw errorData;
          }
        }
        catch(error : CommonErrorResponse | unknown){
          throw error;
        }
      },
      staleTime : 1000 * 10, // 10초
      retry : commonRetry,
    })


    return { data, isLoading, isError, error};
    
    
}