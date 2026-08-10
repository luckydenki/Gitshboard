import { EncryptionKey, User } from "@prisma/client";
import { prisma } from "../app";
import { EncryptedToken } from "../utils/encrypt";


/*
변경된 User 모델 구조
model User{
    id Int @id @default(autoincrement())
    githubId Int @unique()
    githubUsername String
    
   encryptionKey EncryptionKey?
}

model EncryptionKey{
  userId Int @id

  version Int
  ciphertext String
  iv String
  authTag String

  user User @relation(fields: [userId], references: [id])
}

*/

class UserRepository {





    public upsertUser = async(githubId: number, githubUsername: string) : Promise<User|null>=>{
            //테이블 명이 User라면 prisma 멤버에서 카멜케이스로 찾을 수 있음 
            //upsert는 update + insert인 메서드로, 열이 존재하면 update, 존재하지 않으면 insert를 수행
        try{
            const user = await prisma.user.upsert({
                //github Id를 기준으로 검색 where githubId = githubId
                where: {
                    githubId: githubId,
                },
                // 열 정보가 존재할 때 업데이트 할 내용, 쿼리로 치면 
                // update User set githubUsername = githubUsername where githubId = githubId
                update: {
                    githubUsername: githubUsername,
                },
                // 열 정보가 존재하지 않을 때 생성할 내용, 쿼리로 치면
                // insert into User (githubId, githubUsername) values (githubId, githubUsername)
                create: {
                    githubId: githubId,
                    githubUsername: githubUsername,
                }
            });
            return user;

        }catch(error){
            console.error("Error : Github authentication failed", error);
            return null;
        }
    }

    public upsertEncryptionKey = async(userId: number, encryptedToken: EncryptedToken) : Promise<EncryptionKey|null>=>{
        try{
            const encryptionKey = await prisma.encryptionKey.upsert({
                where: {
                    userId: userId,
                },  
                update: {
                    version: encryptedToken.version,
                    ciphertext: encryptedToken.ciphertext,
                    iv: encryptedToken.iv,
                    authTag: encryptedToken.authTag,
                },  
                create: {
                    userId: userId,
                    version: encryptedToken.version,
                    ciphertext: encryptedToken.ciphertext,
                    iv: encryptedToken.iv,
                    authTag: encryptedToken.authTag,
                }   
            }); 
            return encryptionKey;
        }catch(error){
            console.error("Error : Upserting encryption key failed", error);
            return null;
        }
    }


    public getUserById = async(userId: number) : Promise<User|null>=>{
        try{
            const user = await prisma.user.findUnique({ 
                where: {
                    id : userId
                }
            });
            return user;
        }catch(error){
            console.error("Error : Fetching user by id failed", error);
            return null;
        }
    }

    public getEncryptionKeyByUserId = async(userId: number) : Promise<EncryptionKey|null>=>{
        try{
            const encryptionKey = await prisma.encryptionKey.findUnique({
                where: {
                    userId : userId
                }
            });
            return encryptionKey;
        }
        catch(error){
            console.error("Error : Fetching encryption key by user id failed", error);
            return null;
        }
    }


}



const userRepository = new UserRepository();
export default userRepository;