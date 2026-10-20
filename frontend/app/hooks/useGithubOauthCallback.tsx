import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router";
import type { CommonResponse } from "~/types/common/common";

export interface GithubUser {
    id: number;
    login: string;
    accessToken: string;
}

export default function useGithubOauthCallback(url: string, failurl: string) {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const didRun = useRef(false);

    // Github OAuth가 리다이렉트 될 때는 URL "code"쿼리 파라미터로 인증 코드가 전달됨
    const code = searchParams.get("code");
    //Log("Received code:", code);

    useEffect(() => {
        if (didRun.current) return;
        didRun.current = true;

        const authenticate = async () => {
            // error
            try {
                if (!code) {
                    throw new Error("code가 url에 없습니다.");
                }
                //console.log("Using backend URL:", backend_url);
                // 백엔드에 인증 코드 보내서 서버 액세스 토큰 받아오기

                const response = await fetch(`/api/auth/github`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ code }),
                    credentials: "include",
                });

                if (response.ok) {
                    const json = (await response.json()) as CommonResponse<GithubUser>;

                    console.log("인증 성공", json.data);
                    navigate(url + "/" + json.data?.login, { replace: true });
                } else {
                    throw await response.json();
                }
            } catch (error) {
                console.error("인증 실패", error);
                alert("로그인에 실패했습니다 :" + JSON.stringify(error));
                navigate(failurl);
            }
        };

        authenticate();
    }, []);
}
