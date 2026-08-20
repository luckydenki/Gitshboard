import { Navigate } from "react-router";
import type { Route } from "./+types/home";
import TitleLogo from "~/components/design/TitleLogo";
import useAuthCheck from "~/hooks/useAuthCheck";
import SearchForm from "~/components/page/home/SearchForm";
import LoginButton from "~/components/page/home/LoginButton";



export function meta({}: Route.MetaArgs) {
  return [
    { title: "GitHub Dashboard" },
    { name: "description", content: "GitHub Dashboard login" },
  ];
}



export default function Home() {
  const ID =  import.meta.env.VITE_GITHUB_CLIENT_ID;
  const URL = import.meta.env.VITE_GITHUB_CALLBACK_URL;
  
  const { data, isError } = useAuthCheck("home");

  //console.log("home auth check" , data, isLoading, isError, error);
  // console.log("Login Check State:", loginCheckState);

  if(!isError && data && data.success){

    return <Navigate to="/dashboard" replace={true} />
    // navigate()는 컴포넌트가 렌더링된 후에만 호출되므로, 
    // 조건부 렌더링을 통해 리다이렉션을 처리하는 것이 더 안전합니다。
  }

  return (

      <main className="home-ambient flex flex-col gap-8 min-h-screen items-center justify-center overflow-hidden px-6 text-gray-950 dark:text-white">
        
        <header>
            <TitleLogo/>
        </header>

        <section className="flex w-full flex-col items-center gap-4 text-center">
          <SearchForm/>
          {(!data || data.success == false) ? (
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
