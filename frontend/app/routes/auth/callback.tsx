import useGithubOauthCallback from "~/hooks/useGithubOauthCallback";

export default function Callback() {
    useGithubOauthCallback("/user", "/error");

    return (
        <div className="flex h-screen items-center justify-center">
            <h1>로딩 중...</h1>
        </div>
    );
}
