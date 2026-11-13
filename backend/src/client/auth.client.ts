class AuthClient {
    //깃허브 accesss token을 폐기 시켜버리는 로직
    //TODO : 이 로직이 실패했을 시, 재시도 하는 로직이 필요로 합니다.
    public revokeGithubAccessToken = async (accessToken: string): Promise<void> => {
        const clientId = process.env.GITHUB_CLIENT_ID;
        const clientSecret = process.env.GITHUB_CLIENT_SECRET;
        if (!clientId || !clientSecret) throw new Error("GitHub OAuth 앱 설정이 누락되었습니다.");
        const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
        const response = await fetch(
            `https://api.github.com/applications/${encodeURIComponent(clientId)}/token`,
            {
                method: "DELETE",
                headers: {
                    Accept: "application/vnd.github+json",
                    Authorization: `Basic ${credentials}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ access_token: accessToken }),
            },
        );

        if (!response.ok) throw new Error(`GitHub 토큰 폐기 실패: ${response.status}`);
        console.warn("권한 변경 및 깃허브 토큰 파기 완료");
    };

    public getGithubAccessToken = async (code: string): Promise<string | null> => {
        try {
            // Github에 엑세스 토큰 요청
            const response = await fetch("https://github.com/login/oauth/access_token", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    client_id: process.env.GITHUB_CLIENT_ID,
                    client_secret: process.env.GITHUB_CLIENT_SECRET,
                    code: code,
                }),
            });

            if (!response.ok) {
                console.error(
                    "Error : Github access token request failed with status",
                    response.status,
                );
                return null;
            }

            const data = await response.json();
            console.log("Success : Github access token response:", data);

            // Github API를 사용하여 사용자 정보 요청
            const accessToken = data.access_token;
            return accessToken;
        } catch (error) {
            console.error("Error : Github access token request failed", error);
            return null;
        }
    };
}

const authClient = new AuthClient();
export default authClient;
