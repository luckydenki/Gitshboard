import { Router } from 'express';
import {authToken, authUser} from '../middlewares/auth.middleware';
import authController from '../controllers/auth.controllers';


const auth_router = Router();

// api/auth/health
auth_router.get('/health', (req, res)=>{
    res.json({ message: 'Auth route is working!' });
})


//  api/auth/check
// 로그인 된 사용자인지 단순 체크하는 api
auth_router.get('/check', authToken, authUser, authController.checkUser);

// api/auth/github
// 깃허브 로그인 시, 깃허브에서 받은 code를 이용하여 access_token을 발급받고, 
// 해당 access_token으로 깃허브 사용자 정보를 가져오는 api
auth_router.post('/github', authController.getGithubUser);


auth_router.use((req, res) =>{
    res.status(404).json({ error: 'Not Found' });
})

export default auth_router;