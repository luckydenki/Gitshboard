
import  jwt  from 'jsonwebtoken';
import {  User } from '@prisma/client';
import { Response, NextFunction } from 'express';
import { AuthRequest, UserWithAccessToken } from '../types/middlewares/auth';
import { prisma } from '../app';
import { redisClient } from '../infra/redis/redisClient';
import { getDecryptToken, getEncryptionToken } from '../utils/encrypt';

/**
 * JWT 토큰을 검증하여 인증된 사용자임을 확인하는 미들웨어
 * 
 * 실패시 401을 반환하여 실패처리 한다.
 * 성공시 decoded_token에 userId와 githubId를 추가하여 다음 미들웨어로 넘긴다.
 * 
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
export function authToken(req : AuthRequest , res : Response, next : NextFunction){
    const token = req.cookies.app_token;
    
    if(!token){
        return res.status(401).json({ error : '인증 토큰이 없습니다.' });
    }

    try{
        const startTime = performance.now();
        const decoded_token = jwt.verify(token, process.env.JWT_SECRET!);
        const { userId, githubId } = decoded_token as { userId : number, githubId : number };        
        req.decoded_token = { userId, githubId }; //디코딩된 토큰 정보를 요청 객체에 추가
        const endTime = performance.now();
        console.log("Token verification time:", (endTime - startTime).toFixed(2), "milliseconds");

        next();
    }
    catch(error){
        console.error("Error : Token verification error", error);
        return res.status(401).json({ error : '유효하지 않은 토큰입니다.' });
    }

}



/**
 * 
 * userId와 githubId를 기반으로 데이터베이스에서 사용자를 조회하여 인증된 사용자임을 확인하는 미들웨어
 * 
 * 1. decoded_token이 없으면 401을 반환하여 실패처리 한다.
 * 2. decoded_token이 있으면 redis에서 캐시된 사용자 정보를 조회하고 바로 반환한다.
 * 3. redis에 캐시된 정보가 없다면 데이터 베이스에 저장된 사용자 정보를 조회하고 요청 객체에 추가한다.
 * 4. 데이터베이스에 사용자 정보가 없다면 404를 반환하여 실패처리 한다.
 * 
 * 사용자 정보 : User 객체
 * {
 *      id : number,
 *      githubId : number,
 *      githubUsername : string,
 *      githubAccessToken : string
 * }
 * 
 * 
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */

// TODO: access token은 민감 정보니 반드시 암호화 하여 저장할 것. (현재는 암호화 미구현)
export async function authUser(req : AuthRequest , res : Response, next : NextFunction){

    if(req.decoded_token == undefined){
        return res.status(401).json({ error : '인증 토큰이 없습니다.' });
    }


    const { userId, githubId } = req.decoded_token; //authToken 미들웨어에서 디코딩된 토큰 정보 사용

    const cachedUser = await redisClient.get(`gitshboard:user:${userId}:${githubId}`);

    if(cachedUser){
        console.log("Redis hit : user", cachedUser);

        const { id, githubId, githubUsername, encryptedToken } = JSON.parse(cachedUser);
        const githubAccessToken = getDecryptToken(encryptedToken, githubId); //복호화 테스트

        req.user = {
            id,
            githubId,
            githubUsername,
            githubAccessToken
        };

        next();
        return;
    }

    try{
        const startTime = performance.now();
        console.log("Redis miss : user not found in cache, querying database...");
        const user : User | null = await prisma.user.findUnique({
            where : {
                id : userId,
                githubId : githubId,
            }
        })
        const encryptionKey = await prisma.encryptionKey.findUnique({
            where : {
                userId : userId,
            }
        })

        getDecryptToken(encryptionKey!, githubId); //복호화 테스트

        if(!encryptionKey){
            return res.status(404).json({ error : '사용자를 찾을 수 없습니다.' });
        }
        if(!user){
            return res.status(404).json({ error : '사용자를 찾을 수 없습니다.' });
        }


        const userWithAccessToken :  UserWithAccessToken = {
            ...user,
            githubAccessToken : getDecryptToken(encryptionKey!, githubId)
        }

        console.log("Database query result : user", user);

        if(!user){
            return res.status(404).json({ error : '사용자를 찾을 수 없습니다.' });
        }
        else{
            req.user = userWithAccessToken; //인증된 사용자 정보를 요청 객체에 추가

            //const startTime = performance.now();
            //user.githubAccessToken 암호화 작업
            const encryptedToken = getEncryptionToken(userWithAccessToken.githubId, userWithAccessToken.githubAccessToken);
            //const endTime = performance.now();
            //console.log("Token encryption time:", (endTime - startTime).toFixed(2), "milliseconds");
            //console.log("Encrypted githubAccessToken:", encryptedToken);

            //const decryptedToken = getDecryptToken(encryptedToken!, user.id); //복호화 테스트
            //console.log("Decrypted githubAccessToken:", decryptedToken);

            const { id, githubId, githubUsername } = user;

            const redisData = {
                id,
                githubId,
                githubUsername,
                encryptedToken
            }


            await redisClient.set(`gitshboard:user:${userId}:${githubId}`, JSON.stringify(redisData),{
                expiration : {type : 'EX', value : 300 }  //5분
            });


            next(); //성공 시 다음 미들웨어로 넘어감
        }
        const endTime = performance.now();
        console.log("User authentication time:", (endTime - startTime).toFixed(2), "milliseconds");

    }catch(error){
        console.error("Error : User authentication error", error);
        return res.status(500).json({ error : '사용자 인증 중 오류가 발생했습니다.' });
    }    

}


/**
 * JWT 토큰을 검증하여 인증된 사용자임을 확인하는 미들웨어
 * 
 * 해당 미들웨어는 authToken과 다르게 없어도 state만 failed로 넘어갑니다.
 * 
 * 이 미들웨어는 토큰이 있거나 없을 때 모두 동작할 수 있거나 책임을 다음 미들웨어나 라우트 로직에 이관시키고 싶을 때 사용합니다.
 * 
 * @param req 
 * @param res 
 * @param next 
 */

export async function checkToken(req : AuthRequest, res : Response, next : NextFunction){

    const token = req.cookies.app_token;

    if (!token) {
        console.error("Error : 토큰이 없습니다.");
        req.state = "failed";
        req.decoded_token = { userId :-1, githubId:-1};
        next();
        return;
    }
    try {
        const decoded_token = jwt.verify(token, process.env.JWT_SECRET!);
        const { userId, githubId } = decoded_token as { userId: number, githubId: number };
        req.state = "success";
        req.decoded_token = { userId, githubId }; //디코딩된 토큰 정보를 요청 객체에 추가
        next();
    }
    catch (error) {
        console.error("Error : Token verification error", error);
        req.state = "failed";
        req.decoded_token = { userId: -1, githubId: -1 };
        next();
        return;
    }
    
}



/**
 * 
 * userId와 githubId를 기반으로 데이터베이스에서 사용자를 조회하여 인증된 사용자임을 확인하는 미들웨어
 * 
 * 해당 미들웨어는 authUser와 다르게 없어도 state만 failed로 넘어갑니다.
 * 
 * 이 미들웨어는 토큰이 있거나 없을 때 모두 동작할 수 있거나 책임을 다음 미들웨어나 라우트 로직에 이관시키고 싶을 때 사용합니다.
 * 
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
export async function checkUser(req: AuthRequest, res: Response, next: NextFunction) {
    const { userId, githubId } = req.decoded_token!; //authToken 미들웨어에서 디코딩된 토큰 정보 사용

    if(req.state == 'failed'){
        next();
        return;
    }
    try {
        const user: User | null = await prisma.user.findUnique({
            where: {
                id: userId,
            }
        })

        if (!user) {
            req.state = 'failed'
            next();
        }
        else {
            const encryptionKey = await prisma.encryptionKey.findUnique({
                where: {
                    userId: userId,
                }
            })
            
            const decryptedToken = getDecryptToken(encryptionKey!, githubId); //복호화 테스트

            const userWithAccessToken: UserWithAccessToken = {
                ...user,
                githubAccessToken: decryptedToken
            }

            req.user = userWithAccessToken; //인증된 사용자 정보를 요청 객체에 추가
            next(); //성공 시 다음 미들웨어로 넘어감
        }

    } catch (error) {
        console.error("Error : User authentication error", error);
        return res.status(500).json({ error: '사용자 인증 중 오류가 발생했습니다.' });
    }

}
