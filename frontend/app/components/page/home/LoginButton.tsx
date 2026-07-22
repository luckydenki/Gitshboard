import { Github } from "~/icons/Github";
import type { StrictGithubOAuthParams } from "~/types/GithubOAuth";


type LoginButtonMode = "Tiny" | "Normal"

interface LoginButtonProps{
    ID: string;
    URL: string;
    mode? : LoginButtonMode
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





export default function LoginButton({ ID, URL, mode = "Normal" }: LoginButtonProps) {

    let icon_size : number = 0;

    switch(mode){
        case "Tiny":
            icon_size = 36;
            break;
        case "Normal":
            icon_size = 56;
            break;
        default :
            const a : never = mode;
            throw new Error(`Unhandled case: ${a}`);
    }


    return (
           <button
            type="button"
            aria-label="Login with GitHub"
            className={`
                ${mode==="Normal" ? "h-16 p-6 hover:ring-2" : "hover:ring-1 hover:ring-github-light" }
                flex gap-3 items-center justify-center rounded-full
                bg-white 
                not-sm:bg-none not-sm:p-0 not-sm:h-auto
                hover:-translate-y-0.5 
                active:ring-github-light 
                dark:bg-white
                transition-all duration-200 
                `}
            onClick={()=>{
            handleOAuthLogin(ID, URL);
            }}
        > 
            { 
                mode === "Normal" && (
                 <span className="not-sm:hidden text-xl font-semibold">Login with Github </span> 
                )
            }
            
            <Github width={icon_size} height={icon_size} />


        </button>
    )
}