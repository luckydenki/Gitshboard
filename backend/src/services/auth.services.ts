import userRepository from "../repository/user.repository";
import userClient, { GithubUser } from "../client/user.client";
import authClient from "../client/auth.client";
import { User } from "@prisma/client";

export type GithubUserData = {
    githubUserData: GithubUser;
    user: User;
}

class AuthService {

    public getGithubUser = async(code: string) : Promise<GithubUserData | null>=> {
          try{
                    // Github API를 사용하여 사용자 정보 요청
                    const accessToken = await authClient.getGithubAccessToken(code);
                    if(accessToken === null){
                        console.error("Error : Fetching Github access token failed");
                        throw new Error("Fetching Github access token failed");
                    }

                    // 깃허브 사용자 정보
                    const githubUserData = await userClient.getUser(accessToken);

                    if(githubUserData === null){
                        console.error("Error : Fetching Github user failed");
                        throw new Error("Fetching Github user failed");
                    }

                    console.log("Success : Github user data response:", githubUserData);

                    const githubId = githubUserData.id;
                    const githubUsername = githubUserData.login;
                    const githubAccessToken = accessToken;


                    //테이블 명이 User라면 prisma 멤버에서 카멜케이스로 찾을 수 있음 
                    //upsert는 update + insert인 메서드로, 열이 존재하면 update, 존재하지 않으면 insert를 수행
                    const user = await userRepository.upsertUser(githubId, githubUsername, githubAccessToken);

                    if(user === null){
                        console.error("Error : Upserting user failed");
                        throw new Error("Upserting user failed");
                    }
                    

                    return { githubUserData, user };

            }catch(error){
                console.error("Error : Github authentication failed", error);
                return null;
            }
    }
}



const authService = new AuthService();
export default authService;