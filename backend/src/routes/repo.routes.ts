import { Router } from "express";
import { authToken, authUser } from "../middlewares/auth.middleware";
import repoController from "../controllers/repo.controllers";

const repo_router = Router();
/*
    graphql은 etag를 지원하지 않음
    만약 github api에서 일반 rest api를 사용해서 etag를 쓰고 싶다면 다음 내용을 헤더에 추가할 것
    1. 'Accept' : 'application/vnd.github+json',    //github api에서 json 형식으로 응답을 받기 위해 필요함.
    2. 'X-GitHub-Api-Version' : '2022-11-28'        //github api 버전.
*/
// api/repos/health
repo_router.get('/health', (req, res)=>{
    res.json({ message: 'Repo route is working!' });
});

//언어 사용량 
//api/repos/languages
repo_router.get('/languages', authToken, authUser, repoController.languages);

// 커밋 시간
//api/repos/commitTime
repo_router.get('/commitTime', authToken, authUser, repoController.commitTime);

// 프로젝트 토픽
//api/repos/projectTopics
repo_router.get('/projectTopics', authToken, authUser, repoController.projectTopics)


// 실제 개발 관련 통계
//api/repos/developStats  
repo_router.get('/developStats', authToken, authUser, repoController.developStats);

//api : api/repos/projectLiveRate
repo_router.get('/projectLiveRate', authToken, authUser, repoController.projectLiveRate);

export default repo_router;