import { User } from "@prisma/client";
import { prisma } from "../app";
import { getEncryptionToken } from "../utils/encrypt";




class UserRepository {


    public upsertUser = async(githubId: number, githubUsername: string, githubAccessToken: string) : Promise<User|null>=>{
            //테이블 명이 User라면 prisma 멤버에서 카멜케이스로 찾을 수 있음 
            //upsert는 update + insert인 메서드로, 열이 존재하면 update, 존재하지 않으면 insert를 수

        try{
            const user = await prisma.user.upsert({
                //github Id를 기준으로 검색 where githubId = githubId
                where: {
                    githubId: githubId,
                },
                // 열 정보가 존재할 때 업데이트 할 내용, 쿼리로 치면 
                // update User set githubUsername = githubUsername, githubAccessToken = githubAccessToken where githubId = githubId
                update: {
                    githubUsername: githubUsername,
                    githubAccessToken: githubAccessToken,
                },
                // 열 정보가 존재하지 않을 때 생성할 내용, 쿼리로 치면
                // insert into User (githubId, githubUsername, githubAccessToken) values (githubId, githubUsername, githubAccessToken)
                create: {
                    githubId: githubId,
                    githubUsername: githubUsername,
                    githubAccessToken: githubAccessToken,
                }
            });
            return user;

        }catch(error){
            console.error("Error : Github authentication failed", error);
            return null;
        }

    }
}



const userRepository = new UserRepository();
export default userRepository;