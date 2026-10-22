import { Github } from "~/icons/Github";
import type { StrictGithubOAuthParams } from "~/types/GithubOAuth";

type LoginButtonMode = "Tiny" | "Normal";

interface LoginButtonProps {
    // ID and URL are now obtained from environment variables, so they are no longer needed as props.
    mode?: LoginButtonMode;
    disabled?: boolean;
}

const handleOAuthLogin = (ID: string, URL: string) => {
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

export default function LoginButton({ mode = "Normal", disabled = false }: LoginButtonProps) {
    const ID = import.meta.env.VITE_GITHUB_CLIENT_ID;
    const URL = import.meta.env.VITE_GITHUB_CALLBACK_URL;
    let icon_size: number = 0;

    switch (mode) {
        case "Tiny":
            icon_size = 36;
            break;
        case "Normal":
            icon_size = 56;
            break;
        default:
            const a: never = mode;
            throw new Error(`Unhandled case: ${a}`);
    }

    return (
        <button
            type="button"
            aria-label="Login with GitHub"
            disabled={disabled}
            title={disabled ? "Service Unavailable" : "Login with GitHub"}
            className={` ${mode === "Normal" ? "h-16 p-6 hover:ring-2" : "hover:ring-github-light hover:ring-1"} shadow-github-light/20 active:ring-github-light flex items-center justify-center gap-3 rounded-full bg-white shadow-md transition-all duration-200 not-sm:h-auto not-sm:bg-none not-sm:p-0 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white`}
            onClick={() => {
                handleOAuthLogin(ID, URL);
            }}>
            {mode === "Normal" && (
                <span className="text-xl font-semibold not-sm:hidden">Login with Github </span>
            )}

            <Github
                width={icon_size}
                height={icon_size}
            />
        </button>
    );
}
