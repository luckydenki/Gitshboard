
import  jwt  from 'jsonwebtoken';
import {  User } from '@prisma/client';
import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/middlewares/auth';
import { prisma } from '../app';
import { redisClient } from '../infra/redis/redisClient';

/**
 * JWT 토큰을 검증하여 인증된 사용자임을 확인하는 미들웨어
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
 * decoded된 서버 토큰을 바탕으로 db를 조회하고, github access token을 가져오고 redis에 저장합니다.
 * 만약 redis에 캐싱되어있다면 곧바로 redis에서 가져옵니다.
 * 
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
export async function authUser(req : AuthRequest , res : Response, next : NextFunction){

    if(req.decoded_token == undefined){
        return res.status(401).json({ error : '인증 토큰이 없습니다.' });
    }


    const { userId, githubId } = req.decoded_token; //authToken 미들웨어에서 디코딩된 토큰 정보 사용

    const cachedUser = await redisClient.get(`gitshboard:user:${userId}:${githubId}`);

    if(cachedUser){
        console.log("Redis hit : user", cachedUser);
        req.user = JSON.parse(cachedUser) as User;
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
        console.log("Database query result : user", user);

        if(!user){
            return res.status(404).json({ error : '사용자를 찾을 수 없습니다.' });
        }
        else{
            req.user = user; //인증된 사용자 정보를 요청 객체에 추가

            //const cipher = createCipheriv('aes-256-cbc', Buffer.from(process.env.ENCRYPTION_KEY!, 'hex'), Buffer.from(user.githubAccessToken, 'hex'));
            //createCipheriv 설명
            /*
            - 'aes-256-cbc' : AES 알고리즘을 사용하며, 256비트 키와 CBC(Cipher Block Chaining) 모드를 사용합니다.
            - Buffer.from(process.env.ENCRYPTION_KEY!, 'hex') : 환경 변수 ENCRYPTION_KEY를 16진수 문자열로부터 버퍼로 변환합니다. 이 키는 암호화에 사용됩니다.
            - Buffer.from(user.githubAccessToken, 'hex') : 사용자의 GitHub 액세스 토큰을 16진수 문자열로부터 버퍼로 변환합니다. 이 값은 초기화 벡터(IV)로 사용됩니다.
            */
            //console.log("cipher",cipher);

           // const decipher = createDecipheriv('aes-256-cbc', Buffer.from(process.env.ENCRYPTION_KEY!, 'hex'), Buffer.from(user.githubAccessToken, 'hex'));
            //createDecipheriv 설명
            /*
            - 'aes-256-cbc' : AES 알고리즘을 사용하며, 256비트 키와 CBC(Cipher Block Chaining) 모드를 사용합니다.
            - Buffer.from(process.env.ENCRYPTION_KEY!, 'hex') : 환경 변수 ENCRYPTION_KEY를 16진수 문자열로부터 버퍼로 변환합니다. 이 키는 복호화에 사용됩니다.
            - Buffer.from(user.githubAccessToken, 'hex') : 사용자의 GitHub 액세스 토큰을 16진수 문자열로부터 버퍼로 변환합니다. 이 값은 초기화 벡터(IV)로 사용됩니다.
            */


            await redisClient.set(`gitshboard:user:${userId}:${githubId}`, JSON.stringify(user),{
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
                githubId: githubId,
            }
        })

        if (!user) {
            req.state = 'failed'
            next();
        }
        else {
            req.user = user; //인증된 사용자 정보를 요청 객체에 추가
            next(); //성공 시 다음 미들웨어로 넘어감
        }

    } catch (error) {
        console.error("Error : User authentication error", error);
        return res.status(500).json({ error: '사용자 인증 중 오류가 발생했습니다.' });
    }

}
