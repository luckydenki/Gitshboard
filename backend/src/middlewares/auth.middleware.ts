
import  jwt  from 'jsonwebtoken';
import { PrismaClient, User } from '@prisma/client';
import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/middlewares/auth';

const prisma = new PrismaClient();

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
        const decoded_token = jwt.verify(token, process.env.JWT_SECRET!);
        const { userId, githubId } = decoded_token as { userId : number, githubId : number };        
        req.decoded_token = { userId, githubId }; //디코딩된 토큰 정보를 요청 객체에 추가
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
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
export async function authUser(req : AuthRequest , res : Response, next : NextFunction){
    const { userId, githubId } = req.decoded_token!; //authToken 미들웨어에서 디코딩된 토큰 정보 사용

    try{
        const user : User | null = await prisma.user.findUnique({
            where : {
                id : userId,
                githubId : githubId,
            }
        })

        if(!user){
            return res.status(404).json({ error : '사용자를 찾을 수 없습니다.' });
        }
        else{
            req.user = user; //인증된 사용자 정보를 요청 객체에 추가
            next(); //성공 시 다음 미들웨어로 넘어감
        }

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
