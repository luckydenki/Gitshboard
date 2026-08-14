
import  jwt  from 'jsonwebtoken';
import {  User } from '@prisma/client';
import { Response, NextFunction } from 'express';
import { AuthRequest, UserWithAccessToken } from '../types/middlewares/auth';
import { prisma } from '../app';
import { EncryptedToken, getDecryptToken} from '../utils/encrypt';
import userRepository from '../repository/user.repository';
import redisRepository from '../repository/redis.repository';

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

    const redisStart = performance.now();
    //redis 에 cache된 사용자 정보가 있는지 확인합니다.
    const cachedUser = await redisRepository.get<{ id: number, githubId: number, githubUsername: string, encryptedToken: EncryptedToken }>(`gitshboard:user:${userId}`);

    if(cachedUser){
        console.log("Redis hit : user", cachedUser);
        if(cachedUser.encryptedToken === null){
            return res.status(404).json({ error : '잘못된 동작입니다.' });
        }

        const { id, githubId, githubUsername, encryptedToken } = cachedUser;
        const githubAccessToken = getDecryptToken(encryptedToken, githubId); //복호화 테스트

        req.user = {
            id,
            githubId,
            githubUsername,
            githubAccessToken
        };

        next();
        const redisEnd = performance.now();

        //이것도 파란색으로 로그 찍히게...
        console.log("\x1b[34m%s\x1b[0m", `Redis query time: ${(redisEnd - redisStart).toFixed(2)} milliseconds`);
        return;
    }

    try{
        console.log("Redis miss : user not found in cache, querying database...");
        
        const start = performance.now();

        const user : User | null = await userRepository.getUserById(userId);
        const encryptionKey = await userRepository.getEncryptionKeyByUserId(userId);

        const decryptToken = getDecryptToken(encryptionKey!, user!.githubId); //복호화 테스트

        if(!encryptionKey){
            return res.status(404).json({ error : '사용자를 찾을 수 없습니다.' });
        }
        if(!user){
            return res.status(404).json({ error : '사용자를 찾을 수 없습니다.' });
        }

        const userWithAccessToken :  UserWithAccessToken = {
            ...user,
            githubAccessToken : decryptToken
        }

        console.log("Database query result : user", user);

        if(!user){
            return res.status(404).json({ error : '사용자를 찾을 수 없습니다.' });
        }
        else{
            req.user = userWithAccessToken; //인증된 사용자 정보를 요청 객체에 추가

            const redisUser = {
                id: user.id,
                githubId: user.githubId,
                githubUsername: user.githubUsername,
                encryptedToken: encryptionKey
            }
            await redisRepository.set(`gitshboard:user:${userId}`, redisUser, 300);
            next(); //성공 시 다음 미들웨어로 넘어감
        }

        const end = performance.now();

        //파란색으로 로그 찍히게...
        console.log("\x1b[34m%s\x1b[0m", `Database query time: ${(end - start).toFixed(2)} milliseconds`);
        //앞의 \x1b[34m%s\x1b[0m 은 파란색으로 로그를 찍기 위한 ANSI escape code입니다.


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

            console.log(decryptedToken, "복호화 테스트");

            req.user = userWithAccessToken; //인증된 사용자 정보를 요청 객체에 추가
            next(); //성공 시 다음 미들웨어로 넘어감
        }

    } catch (error) {
        console.error("Error : User authentication error", error);
        return res.status(500).json({ error: '사용자 인증 중 오류가 발생했습니다.' });
    }

}
