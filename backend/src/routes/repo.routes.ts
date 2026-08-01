import Router from "express";
import { authToken, authUser } from "../middlewares/auth.middleware";
import { AuthRequest } from "../types/middlewares/auth";
import { CommonResponse, CommonErrorResponse, GithubCommonResponse } from "../types/middlewares/common";
import { dench, DenchAuthType } from "dench-fetch";
import { DevelopStatsNode, GithubCommitTimeRepositoryNode, GithubLanguageRepositoryNode, GithubProjectTopicsNode, GithubRepoCommonResponse, ProjectLiveRateNode } from "../types/statpage";
import { calculateCommitStats, calculateDeveloperProfile, calculateLanguageStats, calculateProjectCategories, calculateProjectHealth,  CommitStats,  DeveloperProfileStats,  LanguageStat, ProjectCategoryStat, ProjectHealthStats } from "../utils/statpage";
const repo_router = Router();


const denchInstance = dench("https://api.github.com/graphql", "projectTopicsDench");

// api/repos/health
repo_router.get('/health', (req, res)=>{
    res.json({ message: 'Repo route is working!' });
});


//언어 사용량 
//api/repos/languages
repo_router.get('/languages', authToken, authUser, async(req : AuthRequest, res)=>{

    if(!req.user){
        return res.status(401).json({ error : '인증된 사용자 정보가 없습니다.' });
    }

    
    const query = `
        query GetRepoLanguages($login : String!){
            user(login : $login){
                repositories(first:20, ownerAffiliations:OWNER){
                    nodes{
                        name
                        languages(first:20){
                            totalSize
                            edges{
                                size
                                node{
                                    name
                                }
                            }
                        }
                    }
                }
            }
        }
    `

    try{
        const variables = {
            login : req.user.githubUsername      
         };

        const github_response = await fetch('https://api.github.com/graphql', {   
            method : 'POST',
            headers : {
                'Authorization' : `token ${req.user.githubAccessToken}`,
                'Content-Type' : 'application/json',
            },
            body : JSON.stringify({
                query,
                variables
            })
        });

        if(github_response.ok){
            const githubData = await github_response.json();


            const userData: GithubRepoCommonResponse<GithubLanguageRepositoryNode> = githubData.data;
            const languageStats = calculateLanguageStats(userData);

            const responseData : CommonResponse<LanguageStat[]> = {
                success : true,
                status : 200,
                data : languageStats
            }
            console.log("[backend] languageStats:", responseData);


            res.status(200).json(responseData);
        }


    }catch(err){
        console.error("Failed to fetch repository languages:", err);

        const errorResponse : CommonErrorResponse = {
            type : "https://developer.github.com/v4",
            title : "GitHub API Error",
            status : 500,
            detail : "레포지토리 언어 사용량 정보를 가져오는 데 실패했습니다.",
        }

        res.status(500).json(errorResponse);
    }
});


// 커밋 시간
//api/repos/commitTime
repo_router.get('/commitTime', authToken, authUser, async(req : AuthRequest, res)=>{
    
    if(!req.user){
        return res.status(401).json({ error : '인증된 사용자 정보가 없습니다.' });
    }

    const query = `
        query GetCommitTimes($login : String!){
            user(login : $login){
                repositories(first : 20){
                    nodes{
                        name
                        defaultBranchRef{
                            target{
                                ... on Commit{
                                    history(first:50){
                                        nodes {
                                            committedDate
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }   
        }
    `

    const variables = {
        login : req.user.githubUsername
    }

    try{
        const github_response = await fetch('https://api.github.com/graphql', {
            method : 'POST',
            headers : {
                'Authorization' : `token ${req.user.githubAccessToken}`,
                'Content-Type' : 'application/json',
            },
            body : JSON.stringify({
                query,
                variables
            })
        })
        
        if(github_response.ok){
            const githubData = await  github_response.json();
            const userData : GithubRepoCommonResponse<GithubCommitTimeRepositoryNode> = githubData.data;
            const commitStats : CommitStats = calculateCommitStats(userData);

           // console.log(userData);

            const responseData : CommonResponse<CommitStats> = {
                success : true,
                status : 200,
                data : commitStats
            }
            console.log("[backend] commitStats:", responseData);
            res.status(200).json(responseData);

        }
        else{
            throw new Error(`GitHub API responded with status ${github_response.status}`);
        }


    }catch(err){
        console.error("Failed to fetch commit time data:", err);

        const errorResponse : CommonErrorResponse = {
            type : "https://developer.github.com/v4",
            title : "GitHub API Error",
            status : 500,
            detail : "커밋 시간 정보를 가져오는 데 실패했습니다.",
        }

        res.status(500).json(errorResponse);
    }
    
})



repo_router.get('/projectTopics', authToken, authUser, async(req : AuthRequest, res)=>{

    if(!req.user){
        return res.status(401).json({ error : '인증된 사용자 정보가 없습니다.' });
    }

    //graphql query에서 String! 이라 되어있는건 String 만 가능하다는 것
    //!를 제거하면 String | null 이므로 null 도 허용된다
    const query = `
        query GetProjectTopics($login : String!){
            user(login : $login){
                repositories(first : 20){
                    nodes {
                        name
                        repositoryTopics(first : 20){
                            nodes {
                                topic {
                                    name
                                }
                            }
                        }
                    }
                }
            }
        }
    `
    
    const variables ={
        login : req.user.githubUsername
    }

    console.log("Fetching project topics with variables:", variables);
    
    const github_response = await denchInstance.post<GithubCommonResponse<any>>("", {
        query,
        variables
    })
    .auth(req.user.githubAccessToken, DenchAuthType.BEARER)
    .sendJson()
    .error((err)=>{
        console.error("Failed to fetch project topics data:", err);
        res.status(500).json({ error : '프로젝트 토픽 정보를 가져오는 데 실패했습니다.' });
    }).toJson();
    


    if(github_response){
        const userData : GithubRepoCommonResponse<GithubProjectTopicsNode> = github_response.data;
        const projectTopics : ProjectCategoryStat[] = calculateProjectCategories(userData);
        const responseData : CommonResponse<ProjectCategoryStat[]> = {
            success : true,
            status : 200,
            data : projectTopics
        }
        console.log("[backend] projectTopics:", responseData);
        res.status(200).json(responseData);
    }
})


repo_router.get('/developStats', authToken, authUser, async(req: AuthRequest, res)=>{
    if(!req.user){
        return res.status(401).json({ error : '인증된 사용자 정보가 없습니다.' });
    }

    const query = `
        query GetDevelopTime($login : String!){
            user(login : $login){
                repositories(first : 20){
                    nodes {
                        defaultBranchRef{
                            target{
                                ... on Commit{
                                    history(first : 30){
                                        nodes{
                                            committedDate    
                                        }
                                    }
                                }
                            }
                        }
                        languages(first : 20){
                            edges{
                                node{
                                    name
                                }
                            }
                        }
                        repositoryTopics(first : 20){
                            nodes{
                                topic{
                                    name
                                }
                            }
                        }
                    }
                }
            }
        }
    `

    const variables ={
        login : req.user.githubUsername
    }

    const github_response = await denchInstance.post<GithubCommonResponse<GithubRepoCommonResponse<DevelopStatsNode>>>("",{
        query,
        variables
    })
    .auth(req.user.githubAccessToken, DenchAuthType.BEARER)
    .sendJson()
    .error((err)=>{
        console.error("Failed to fetch development stats data:", err);
        res.status(500).json({ error : '개발 통계 정보를 가져오는 데 실패했습니다.' });
    })
    .toJson();

    if(github_response){
        const userData = github_response.data;
        const developerProfileStats = calculateDeveloperProfile(userData);
        const responseData : CommonResponse<DeveloperProfileStats> = {
            success : true,
            status : 200,
            data : developerProfileStats
        }

        console.log("[backend] developStats:", responseData);
        res.status(200).json(responseData);
    }
    else{
        const errorResponse : CommonErrorResponse = {
            type : "https://developer.github.com/v4",
            title : "GitHub API Error",
            status : 500,
            detail : "개발 통계 정보를 가져오는 데 실패했습니다.",
        }

        res.status(500).json(errorResponse);
    }
})





//api : api/repos/projectLiveRate
repo_router.get('/projectLiveRate', authToken, authUser, async(req: AuthRequest, res)=>{

    if(!req.user){
        return res.status(401).json({ error : '인증된 사용자 정보가 없습니다.' });
    }

    const query = `
        query getProjectLiveRate($login : String!){
            user(login : $login){
                repositories(first : 20){
                    nodes{
                        createdAt
                        updatedAt
                        pushedAt
                        isArchived
                        isFork
                        name
                    }   
                }
            }
        }
    `

    const variables = {
        login : req.user.githubUsername
    }

    const github_response = await denchInstance.post<GithubCommonResponse<GithubRepoCommonResponse<ProjectLiveRateNode>>>("",{
        query,
        variables
    })
    .auth(req.user.githubAccessToken, DenchAuthType.BEARER)
    .sendJson()
    .error((err)=>{
        console.error("Failed to fetch project live rate data:", err);
        res.status(500).json({ error : '프로젝트 활동률 정보를 가져오는 데 실패했습니다.' });
    })
    .toJson();


    if(github_response){
        const userData = github_response.data;
        const projectHealthStats = calculateProjectHealth(userData);
        const responseData : CommonResponse<ProjectHealthStats> = {
            success : true,
            status : 200,
            data : projectHealthStats
        }

        console.log("[backend] projectLiveRate:", responseData);
        res.status(200).json(responseData);
    }   
    else{
        const errorResponse : CommonErrorResponse = {
            type : "https://developer.github.com/v4",
            title : "GitHub API Error",
            status : 500,
            detail : "프로젝트 활동률 정보를 가져오는 데 실패했습니다.",
        }
        res.status(500).json(errorResponse);
    }
})




export default repo_router;