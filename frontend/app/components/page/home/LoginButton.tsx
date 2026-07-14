import { Github } from "~/icons/Github";
import type { StrictGithubOAuthParams } from "~/types/GithubOAuth";


interface LoginButtonProps{
    ID: string;
    URL: string;
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





export default function LoginButton({ ID, URL }: LoginButtonProps) {

    return (
           <button
            type="button"
            aria-label="Login with GitHub"
            className={`flex gap-3 h-16 p-6 items-center justify-center rounded-full
                bg-white 
                not-sm:bg-none  transition-all duration-200 
                hover:-translate-y-0.5 hover:ring-2 
                active:ring-github-light 
                dark:bg-white`}
            onClick={()=>{
            handleOAuthLogin(ID, URL);
            }}
        > 
            <span className="not-sm:hidden text-xl font-semibold">Login with Github </span>
            <Github width={56} height={56} />
        </button>
    )
}