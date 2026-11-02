import useGithubOauthCallback from "~/hooks/useGithubOauthCallback";

export default function Callback() {
    useGithubOauthCallback("/user", "/error");

    return (
        <>
            <title>GitHub 로그인 중 - Gitshboard</title>
            <div className="flex h-screen items-center justify-center">
                <h1>로딩 중...</h1>
            </div>
        </>
    );
}
