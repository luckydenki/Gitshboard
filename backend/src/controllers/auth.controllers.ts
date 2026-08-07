import jwt from 'jsonwebtoken';
import { CookieOptions } from 'express';
import { Request, Response } from 'express';
import { AuthRequest } from '../types/middlewares/auth';
import authService from '../services/auth.services';
import { CommonErrorResponse, CommonResponse } from '../types/middlewares/common';

class AuthController {

        public checkUser = async(req: AuthRequest, res: Response)=>{
            res.json({ 
                success : true,
                message : '인증된 사용자입니다.',
            });
        }

        
        public getGithubUser = async(req: Request, res: Response)=>{
        //Express는 응답을 한번만 보낼 수 있음. 조심하셈
            const { code }  = req.body;
            try{
                    const userData = await authService.getGithubUser(code);
                    if(!userData){
                        console.error("Error : Github authentication failed");
                        throw new Error("Github authentication failed");
                    }

                    const { githubUserData, user } = userData;
                    

                    //console.log("Success : Update and Insert user data To DB", user);
            
                    // model User{
                    //     id Int @id @default(autoincrement())
                    //     githubId Int @unique()
                    //     githubUsername String
                    //     githubAccessToken String
                    // }
        
                    const jwtToken = process.env.JWT_SECRET;
                    const appToken = jwt.sign(
                        {                           //payload
                            userId : user.id,
                            githubId : user.githubId,
                        },
                        jwtToken!,                 //secret key
                        { expiresIn : '1h' }        //options
                    );
        
                    //sameSite 옵션
                    // - 'strict' : 엄격한 sameSite 정책, 타 사이트에서 쿠키 전송 불가
                    // - 'lax' : 타 사이트에서 쿠키 전송 허용, 단 GET 요청에 한함
                    // - 'none' : 모든 상황에서 쿠키 전송 허용, 단 secure 옵션도 true로 설정해야 함 (브라우저 강제 사항)
        
                    const cookieOptions : CookieOptions ={
                        httpOnly : true,            //http only 활성화
                        secure : true,              //https에서만 쿠키 전송, 다만 개발환경에서는 false로 설정
                        sameSite : 'none',          //CSRF 공격 방지는 어쩔수가 없이 false로 해야할 듯
                        maxAge : 240 * 60 * 1000,   //쿠키 만료 시간 설정, ms 단위, 4시간
                    }
                    res.cookie('app_token', appToken, cookieOptions);
        
                    console.log("Success : Set cookie with JWT token", { appToken, cookieOptions });
        
                    
                    const response : CommonResponse<typeof githubUserData> ={
                        success : true,
                        status : 200,
                        data : githubUserData,
                    }
                    res.json(response);

            }catch(error){
                console.log("Error : Github authentication error", error);

                const errorResponse : CommonErrorResponse ={
                    status : 500,
                    type : 'Github authentication error',
                    title : 'Github authentication error',
                    detail : (error as Error).message,
                }

                res.status(500).json(errorResponse);
            }
        }
}


const authController = new AuthController();
export default authController;