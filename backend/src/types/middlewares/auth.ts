import { User } from "@prisma/client";
import {Request} from 'express';


export interface AuthRequest extends Request {
    state? : 'success' | 'failed'
    user? : User;
    decoded_token? : { userId : number, githubId : number };
}