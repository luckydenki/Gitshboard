import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import type { Route } from "./+types/home";
import { Github } from "~/icons/Github";
import type { StrictGithubOAuthParams } from "~/types/GithubOAuth";
import MovingStrip from "~/components/page/home/MovingStrip";
import useAuthCheck from "~/hooks/useAuthCheck";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "GitHub Dashboard" },
    { name: "description", content: "GitHub Dashboard login" },
  ];
}


const handleOAuthLogin = (ID: string, URL: string) => {
  const baseURL = "https://github.com/login/oauth/authorize";
  const githubOAuthParams : StrictGithubOAuthParams = {
    client_id : ID,
    redirect_uri : URL,
    scope : ["read:user"]
  };

  const params = new URLSearchParams( {
    ...githubOAuthParams,
    scope : githubOAuthParams.scope.join(' '), 
  } );
  window.location.href = `${baseURL}?${params.toString()}`;

};


export default function Home() {
  const ID =  import.meta.env.VITE_GITHUB_CLIENT_ID;
  const URL = import.meta.env.VITE_GITHUB_CALLBACK_URL;
  const navigate = useNavigate();
  
  const { loginCheckState } = useAuthCheck();

  useEffect(()=>{
    if(loginCheckState){
      navigate("/dashboard");
    }
  },[loginCheckState, navigate])
 
  console.log("Login Check State:", loginCheckState);

  if(loginCheckState === null){
    // login 체크를 일단 수행한 뒤, 안된다면 메인을 띄우고 되었다면 대시보드로 리다이렉션 시킨다
    return null;
  }

  if(loginCheckState === true){
    return(
        <div className="w-screen h-screen bg-gray-300"></div>
    )
  }

  return (

      <main className="home-ambient relative flex min-h-screen items-center justify-center overflow-hidden px-6 text-gray-950 dark:text-white">
        
        <section className="relative flex w-full flex-col items-center gap-7 text-center">
          

          <div className="flex flex-row items-center gap-4 not-sm:gap-0">
            <img src="/Gitshboard_alpha.png" alt="Gitshboard Logo" className="animate-bounce-slow w-32 not-sm:hidden" />
            <h1 className="text-7xl not-sm:text-5xl font-semibold tracking-wide text-gray-950 dark:text-white ">
              <span>Git</span>
              <span className="text-github-light">sh</span>
              <span>board</span>
            </h1>
          </div>
  
          <input type="text"
            className="w-full h-16 max-w-4xl pl-8 text-xl not-sm:text-sm not-sm:h-12 rounded-full border border-gray-300 bg-white px-4 py-2 focus:outline-none focus:ring-github-light focus:ring-2 text-gray-950 shadow-md dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-github-light dark:focus:ring-github-light/50 transition-all duration-200"
            placeholder="Search for users"
          />

          {loginCheckState === false || loginCheckState === null ? (
            <button
              type="button"
              aria-label="Login with GitHub"
              className="flex gap-3 h-16 p-6 items-center justify-center rounded-full bg-white not-sm:bg-none  transition-all duration-200 hover:-translate-y-0.5 hover:ring-2 active:ring-github-light dark:bg-white"
              onClick={()=>{
                handleOAuthLogin(ID, URL);
              }}
            > 
              <span className="not-sm:hidden text-xl font-semibold">Login with Github </span>
                <Github width={56} height={56} />
            </button>
          ): 
            <div className="h-32 w-32 rounded-full bg-white/80 p-6 shadow-[0_22px_60px_rgba(15,23,42,0.10)] dark:bg-white/10">
              <span className="block h-full w-full animate-pulse rounded-full bg-github-light" />
            </div>
          }

        </section>

      </main>

  );
}
