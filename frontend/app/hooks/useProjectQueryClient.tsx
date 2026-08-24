import { QueryCache, QueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useRef } from "react";
import { commonRetry } from "~/utils/tanstackUtil";




export default function useProjectQueryClient(){
  
    const navigate = useNavigate();
    const handle_401_Ref = useRef(false);

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
      queryCache : new QueryCache({

        onError : (error : any)=>{
          if('status' in error){
            //401 에러이면서 현재 위치가 home 화면만 아니면 됨
              if( error.status  === 401 && window.location.pathname !== "/" && !handle_401_Ref.current){
                handle_401_Ref.current = true;
                alert("다시 로그인 해주세요.");
                navigate("/", { replace : true });
              }
          }

          //CommonErrorResponse 타입이 아닌 완전한 예외 상황, 보통 네트워크 에러인 경우일 가능성 농후
          else{
              throw error;
          }
        }
      })

    })); //이렇게 하면 컴포넌트가 처음 렌더링 될 때 한 번만 생성되고 이후에는 같은 인스턴스를 사용합니다.
    

  
  return queryClient;
}