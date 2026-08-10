import { User } from "@prisma/client";
import {Request} from 'express';


export interface UserWithAccessToken extends User {
    githubAccessToken : string;
}



export interface AuthRequest extends Request {
    state? : 'success' | 'failed'
    user? : UserWithAccessToken;
    decoded_token? : { userId : number, githubId : number };
}