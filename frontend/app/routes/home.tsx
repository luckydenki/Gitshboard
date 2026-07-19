import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import type { Route } from "./+types/home";
import useAuthCheck from "~/hooks/useAuthCheck";
import TitleLogo from "~/components/design/TitleLogo";
import SearchForm from "~/components/page/home/SearchForm";
import LoginButton from "~/components/page/home/LoginButton";
import { isLocal} from '~/utils/log_system/log';


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
