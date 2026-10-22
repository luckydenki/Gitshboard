import { SiGithub } from "@icons-pack/react-simple-icons";
import type { StrictGithubOAuthParams } from "~/types/GithubOAuth";

const handleOAuthLogin = () => {
    const ID = import.meta.env.VITE_GITHUB_CLIENT_ID;
    const URL = import.meta.env.VITE_GITHUB_CALLBACK_URL;
    const baseURL = "https://github.com/login/oauth/authorize";
    const githubOAuthParams: StrictGithubOAuthParams = {
        client_id: ID,
        redirect_uri: URL,
        scope: ["read:user"],
    };

    const params = new URLSearchParams({
        ...githubOAuthParams,
        scope: githubOAuthParams.scope.join(" "),
    });
    window.location.href = `${baseURL}?${params.toString()}`;
};

export default function LoginButton() {
    return (
        <button
            className={`hover:ring-primary bg-github-black flex gap-2 rounded-full px-4 py-2 text-white not-lg:p-1 hover:cursor-pointer hover:ring-2`}
            onClick={() => {
                handleOAuthLogin();
            }}>
            <SiGithub aria-label="깃허브 Oauth 로그인 버튼" />
            <span className="not-lg:hidden">깃허브 로그인</span>
        </button>
    );
}
