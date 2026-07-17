import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import type { Route } from "./+types/home";
import useAuthCheck from "~/hooks/useAuthCheck";
import TitleLogo from "~/components/design/TitleLogo";
import SearchForm from "~/components/page/home/SearchForm";
import LoginButton from "~/components/page/home/LoginButton";
import { isLocal} from '~/utils/log_system/log';

/** 임시 tailwind css 작성 규칙
 * 
 * 1. 요소가 놓일 포지션 위치와 관련된 클래스
 * ex) flex, grid, absolute, top-0, left-0, items-center, gap
 * 
 * 2. 요소의 크기와 관련된 클래스
 * ex) w-1/2, h-12, min-w-md, max-w-4xl, p-6, m-4
 * 
 * 3. 배경, 테두리, 그림자 관련 클래스
 * ex) bg-gray-300, bg-white, border, border-gray-300, shadow-md
 * 
 * 4. 글자, 폰트 관련 클래스
 * ex) text-sm, text-lg, font-bold, font-medium, font-light...
 * 
 * 5. 상태 관련 클래스
 * ex) hover:bg-gray-200, focus:outline-none, active:ring-2....
 * 
 * 6. 반응형 관련 클래스
 * ex) sm:text-sm, md:text-lg, lg:text-xl, not-sm:text-sm, not-md:text-lg...
 * 
 * 7. animation, transition 관련 클래스, 만약 css로 직접 만든 애니메이션이 있다면 여기에 작성.
 * ex) animate-pulse, transition-all, duration-200, ease-in-out...
 * 
 * 8. 그외 기타 커스텀 css, 또는 위에 해당하지 않는 모든 클래스
 * 
 * 
 */



export function meta({}: Route.MetaArgs) {
  return [
    { title: "GitHub Dashboard" },
    { name: "description", content: "GitHub Dashboard login" },
  ];
}



export default function Home() {
  const ID =  import.meta.env.VITE_GITHUB_CLIENT_ID;
  const URL = import.meta.env.VITE_GITHUB_CALLBACK_URL;
  const navigate = useNavigate();
  
  const { loginCheckState } = useAuthCheck();

  console.log("isLocal:", isLocal());

  useEffect(()=>{
    if(loginCheckState){
      navigate("/dashboard");
    }
  },[loginCheckState, navigate])
 
  // console.log("Login Check State:", loginCheckState);

  if(loginCheckState === null){
    return null;
  }

  if(loginCheckState === true){
    return(
        <div className="w-screen h-screen bg-gray-300"></div>
    )
  }

  return (

      <main className="home-ambient  flex flex-col gap-8 min-h-screen items-center justify-center overflow-hidden px-6 text-gray-950 dark:text-white">
        
        <header>
            <TitleLogo/>
        </header>

        <section className="flex w-full flex-col items-center gap-4 text-center">
          <SearchForm/>
          {loginCheckState === false || loginCheckState === null ? (
            <LoginButton ID={ID} URL={URL} />
          ): 
            <div className="h-32 w-32 rounded-full bg-white/80 p-6 shadow-[0_22px_60px_rgba(15,23,42,0.10)] dark:bg-white/10">
              <span className="block h-full w-full animate-pulse rounded-full bg-github-light" />
            </div>
          }
        </section>

      </main>

  );
}
