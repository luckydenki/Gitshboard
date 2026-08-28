import type { CommonResponse } from "~/types/common/common";
import CommonError from "~/utils/common-error";
import { commonRetry } from "~/utils/tanstack-utils";
import { useState } from "react";
import { QueryKeys } from "~/types/query-key-enum";
import useManagedKeyQuery from "./useManagedKeyQuery";





/**
 * 인증 상태인지 확인하는 훅입니다.
 * 
 * - 성공시 : { success: true, status: 200, data: '인증된 사용자입니다.' }
 * - 실패시 : { success: false, status: 200, data: null }
 * 
 * 따라서 해당 훅은 인증이 되어있는지 검증만 하고 싶을 때 사용하세요.
 * 그 외 네트워크 에러는 500 에러로 throw됩니다.
 * 
 * @returns { data: CommonResponse<string> | undefined, isLoading: boolean, isError: boolean }
 */
export default function useAuthCheck(){

    const [_, setTrigger] = useState(false);  

    const { data, isLoading, isFetching, isError, error } = useManagedKeyQuery([QueryKeys.AUTH_CHECK],{
      queryFn : async()=>{
              try{
                const res = await fetch(`/api/auth/check`,{
                  method : 'GET',
                  credentials : 'include'
                })

                const data : CommonResponse<string> = await res.json();
                return data;
                
              }
              catch(error : unknown){
                throw new CommonError(
                  {
                    status : 500,
                    title : "Network Error",
                    type : "NetworkError",
                    detail : "Network error occurred while checking authentication status."
                  }
                )
              }
            },
            staleTime : 30 * 1000, //30초
            retry : commonRetry,
            refetchOnWindowFocus : 'always', 
    })
  


    return { isSuccess: data?.success, isLoading, isFetching, isError, error, refetch : () => setTrigger(prev => !prev) };
    
    
}