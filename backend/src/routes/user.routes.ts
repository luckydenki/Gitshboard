import Router from 'express';
import { AuthRequest } from '../types/middlewares/auth';
import { authToken, authUser } from '../middlewares/auth.middleware';
import { CommonErrorResponse, CommonResponse, ErrorStatus, GithubCommonResponse } from '../types/middlewares/common';
import { GithubUser } from '../client/user.client';

const user_router = Router();


interface GithubUserResponse{
    user : {
        login : string,
        avatarUrl : string,
    }
}



// api/users/health
user_router.get('/health', (req, res)=>{
    res.json({ message: 'User route is working!' });
})



// api/users
user_router.get('/', authToken, authUser, async (req: AuthRequest, res) => {

  const user = req.user!; //authUser 미들웨어에서 인증된 사용자 정보를 요청 객체에 추가했으므로 req.user는 항상 존재한다고 가정할 수 있음

console.log("Authenticated user:", user);

  try{
        const accessToken = user.githubAccessToken;

        const github_response = await fetch('https://api.github.com/user', {
            headers : {
                'Authorization' : `token ${accessToken}`
            }
        }); 
        
        if(github_response.ok){
            const github_user = await github_response.json();
            
            const response : CommonResponse<typeof github_user> = {
                success : true,
                status : 200,
                data : github_user
            }
            res.status(200).json(response);
        }
        else{
            const errorResponse : CommonErrorResponse = {
                status : github_response.status as ErrorStatus,
                title : 'GitHub API 요청 실패',
                type : 'GitHub API Error',
                detail : `GitHub API 요청 중 오류가 발생했습니다. 상태 코드: ${github_response.status}`,
                instance : '/api/users'
            }

            throw errorResponse;
        }
    }
    catch(err : unknown){
        let errorResponse : CommonErrorResponse;

        if(err instanceof Error){
            errorResponse = {
                status : 500,
                title : 'Internal Server Error',
                type : 'Server Error',
                detail : err.message,
                instance : '/api/users'
            }
        }
        else errorResponse = err as CommonErrorResponse;

        res.status(errorResponse?.status || 500).json(errorResponse);

    }

});


/**
 *     userDataState : {
        avatar_url : string,
        login : string
    }
    오직 헤더 컴포넌트만을 위해 가져오는 간단한 정보
 **/
// api/users/userheader
user_router.get('/userheader', authToken, authUser, async(req : AuthRequest, res)=>{
    const user = req.user!;

    const query = `
        query GetUser($login : String!){
            user(login : $login){
                login
                avatarUrl
            }
        }
    `
    try{
        const github_response = await fetch('https://api.github.com/graphql',{
        method : 'POST',
        headers :{
            'Authorization' : `Bearer ${user.githubAccessToken}`,
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify({
            query,
            variables : {
                login : user.githubUsername
            }
        })
    })

        const data  = await github_response.json();

        const userData = ChangeResponseType<GithubCommonResponse<GithubUserResponse>>(data).data.user;
        console.log("GitHub GraphQL API response:", data);

        if(github_response.ok){

            const response : CommonResponse<typeof userData> = {
                status : 200,
                success : true,
                data : userData
            }

            res.status(200).json(response);
        }
        else{

            console.error("GitHub GraphQL API error:", github_response.status);

            const errorResponse : CommonErrorResponse ={
                status : github_response.status as ErrorStatus,
                type : 'GitHub API Error',
                title : 'GitHub API 요청 실패',
                detail : data.errors?.[0]?.message || 'GitHub API 요청 중 오류가 발생했습니다.',
                instance : '/api/users/userheader'
            }

            res.status(github_response.status).json(errorResponse);
        }
        }
    catch(error){
        console.error("Error fetching GitHub user header:", error);
        res.status(500).json({ error: '서버 에러' });
    }

})


function ChangeResponseType <T>(data : unknown) : T{
    return data as T;
}


// api/users/repos
user_router.get('/repos', authToken, authUser, async(req : AuthRequest, res)=>{
    const user = req.user!;
    const username = user.githubUsername;
    const accessToken  = user.githubAccessToken;

    try{
        const github_response = await fetch(`https://api.github.com/users/${username}/repos`, {
            headers : {
                'Authorization' : `token ${accessToken}`
            }
        });

        console.log("GitHub API response status:", github_response.status);

        if(github_response.ok){
            const github_repos = await github_response.json();
            res.status(200).json({ repos : github_repos });
        }
        else{
            throw { status : github_response.status, message : 'GitHub API 요청 실패' };
        }
    }

    catch(error){
        //어떤 이유에 의한 에러인게 구체적으로 들어오면 항상 {status, message} 형태로 error가 옵니다.
        if(typeof error === 'object' && error !== null && 'status' in error && 'message' in error){
            const { status, message } = error as { status : number, message : string };
            res.status(status).json({ error : message });
            return;
        }
        else
            res.status(500).json({ error : '서버 에러' });
    }

})



user_router.use((req, res) => {
    res.status(404).json({ error: 'Not Found' });
});

export default user_router;