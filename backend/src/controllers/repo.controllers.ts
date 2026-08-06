import { redisClient } from "../infra/redis/redisClient";
import { AuthRequest } from "../types/middlewares/auth";
import { Response } from "express";
import { CommonErrorResponse, CommonResponse, GithubCommonResponse } from "../types/middlewares/common";
import { calculateCommitStats, calculateDeveloperProfile, calculateLanguageStats, calculateProjectCategories, calculateProjectHealth, CommitStats, DeveloperProfileStats, LanguageStat, ProjectCategoryStat, ProjectHealthStats } from "../utils/stat";
import { GithubCommitTimeRepositoryNode, GithubLanguageRepositoryNode, GithubProjectTopicsNode, GithubRepoCommonResponse, ProjectLiveRateNode } from "../types/stat";
import { DenchAuthType } from "dench-fetch";

const REDIS_DATA_EXPIRATION = 300; // 5분 동안 유지


export const languages = async (req : AuthRequest, res : Response) => {
    if(!req.user){
        return res.status(401).json({ error : '인증된 사용자 정보가 없습니다.' });
    }

    //304 Not Modified 요청에 대한 대비
    const cachedData = await redisClient.get(`gitshboard:stats:${req.user.githubId}:languages`);
    //console.log("cachedData:", cachedData);
    //없을 경우 cachedData는 null임.
    if(cachedData){
        console.log("Redis hit : languages");

        const responseData : CommonResponse<LanguageStat[]> = {
            success : true,
            status : 200,
            data : JSON.parse(cachedData)
        }
        res.status(200).json(responseData);
        return;
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

            redisClient.set(`gitshboard:stats:${req.user.githubId}:languages`, JSON.stringify(languageStats), {
                expiration: { type: 'EX', value: REDIS_DATA_EXPIRATION } // 5분 동안 유지
            });


           // console.log("[backend] languageStats", languageStats);

            const responseData : CommonResponse<LanguageStat[]> = {
                success : true,
                status : 200,
                data : languageStats
            }


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
}



export const commitTime = async (req: AuthRequest, res : Response) => {

    if (!req.user) {
        return res.status(401).json({ error: '인증된 사용자 정보가 없습니다.' });
    }

    //304 Not Modified 요청에 대한 대비
    const cachedData = await redisClient.get(`gitshboard:stats:${req.user.githubId}:commitTime`);

    //없을 경우 cachedData는 null임.
    if (cachedData) {
        console.log("Redis hit : commitTime");
        const responseData: CommonResponse<CommitStats> = {
            success: true,
            status: 200,
            data: JSON.parse(cachedData)
        }
        res.status(200).json(responseData);
        return;
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
        login: req.user.githubUsername
    }

    try {
        const github_response = await fetch('https://api.github.com/graphql', {
            method: 'POST',
            headers: {
                'Authorization': `token ${req.user.githubAccessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query,
                variables
            })
        })

        if (github_response.ok) {
            const githubData = await github_response.json();
            const userData: GithubRepoCommonResponse<GithubCommitTimeRepositoryNode> = githubData.data;
            const commitStats: CommitStats = calculateCommitStats(userData);

            // console.log("[backend] commitStats:", commitStats);

            redisClient.set(`gitshboard:stats:${req.user.githubId}:commitTime`, JSON.stringify(commitStats), {
                expiration: { type: 'EX', value: REDIS_DATA_EXPIRATION } // 5분 동안 유지
            });

            const responseData: CommonResponse<CommitStats> = {
                success: true,
                status: 200,
                data: commitStats
            }
            res.status(200).json(responseData);

        }
        else {
            throw new Error(`GitHub API responded with status ${github_response.status}`);
        }


    } catch (err) {
        console.error("Failed to fetch commit time data:", err);

        const errorResponse: CommonErrorResponse = {
            type: "https://developer.github.com/v4",
            title: "GitHub API Error",
            status: 500,
            detail: "커밋 시간 정보를 가져오는 데 실패했습니다.",
        }

        res.status(500).json(errorResponse);
    }

}


export const projectTopics = async (req: AuthRequest, res: Response) => {

    if (!req.user) {
        return res.status(401).json({ error: '인증된 사용자 정보가 없습니다.' });
    }


    //redis 성능 측정 

    const startTime = performance.now();

    const cachedData = await redisClient.get(`gitshboard:stats:${req.user.githubId}:projectTopics`);

    //없을 경우 cachedData는 null임.
    if (cachedData) {
        const endTime = performance.now();

        console.log("Redis hit : projectTopics");
        console.log("Time taken to fetch from Redis:", (endTime - startTime).toFixed(2), "milliseconds");

        const startTime2 = performance.now();
        const responseData: CommonResponse<ProjectCategoryStat[]> = {
            success: true,
            status: 200,
            data: JSON.parse(cachedData)
        }
        const endTime2 = performance.now();
        res.status(200).json(responseData);
        console.log("Time taken to parse JSON and prepare response:", (endTime2 - startTime2).toFixed(2), "milliseconds");

        return;
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

    const variables = {
        login: req.user.githubUsername
    }

    const github_response = await fetch("https://api.github.com/graphql", {
        method: 'POST',
        headers: {
            'Authorization': `token ${req.user.githubAccessToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query,
            variables
        })
    });
    

    if(github_response.ok){
        const githubData = await github_response.json();
        const userData: GithubRepoCommonResponse<GithubProjectTopicsNode> = githubData.data;
        const projectTopics: ProjectCategoryStat[] = calculateProjectCategories(userData);
        console.log("[backend] projectTopics:", projectTopics);

        redisClient.set(`gitshboard:stats:${req.user.githubId}:projectTopics`, JSON.stringify(projectTopics), {
            expiration: { type: 'EX', value: REDIS_DATA_EXPIRATION } // 5분 동안 유지
        });

        const responseData: CommonResponse<ProjectCategoryStat[]> = {
            success: true,
            status: 200,
            data: projectTopics
        }
        res.status(200).json(responseData);
    }
    else {
        const errorResponse: CommonErrorResponse = {
            type: "https://developer.github.com/v4",
            title: "GitHub API Error",
            status: 500,
            detail: "프로젝트 토픽 정보를 가져오는 데 실패했습니다.",
        }

        res.status(500).json(errorResponse);
    }
}



export const developStats =  async(req: AuthRequest, res : Response)=>{
    if(!req.user){
        return res.status(401).json({ error : '인증된 사용자 정보가 없습니다.' });
    }


    //304 Not Modified 요청에 대한 대비
    const cachedData = await redisClient.get(`gitshboard:stats:${req.user.githubId}:developStats`);

    //없을 경우 cachedData는 null임.
    if (cachedData) {
        console.log("Redis hit : developStats");
        const responseData : CommonResponse<DeveloperProfileStats> = {
            success : true,
            status : 200,
            data : JSON.parse(cachedData)
        }

        res.status(200).json(responseData);
        return;
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

    const github_response = await fetch("https://api.github.com/graphql", {
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
        const githubData = await github_response.json();
        const userData: GithubRepoCommonResponse<GithubCommitTimeRepositoryNode & GithubLanguageRepositoryNode & GithubProjectTopicsNode> = githubData.data;
        const developerProfileStats: DeveloperProfileStats = calculateDeveloperProfile(userData);

        const responseData : CommonResponse<DeveloperProfileStats> = {
            success : true,
            status : 200,
            data : developerProfileStats
        }

        redisClient.set(`gitshboard:stats:${req.user.githubId}:developStats`, JSON.stringify(developerProfileStats), {
            expiration: { type: 'EX', value: REDIS_DATA_EXPIRATION } // 5분 동안 유지
        });

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
}



export const projectLiveRate = async(req: AuthRequest, res :  Response)=>{

    if(!req.user){
        return res.status(401).json({ error : '인증된 사용자 정보가 없습니다.' });
    }

    //304 Not Modified 요청에 대한 대비
    const cachedData = await redisClient.get(`gitshboard:stats:${req.user.githubId}:projectLiveRate`);

    //없을 경우 cachedData는 null임.
    if (cachedData) {
        console.log("Redis hit : projectLiveRate");

        const responseData : CommonResponse<ProjectHealthStats> = {
            success : true,
            status : 200,
            data : JSON.parse(cachedData)
        }

        res.status(200).json(responseData);
        return;
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

    const github_response = await fetch("https://api.github.com/graphql", {
        method : 'POST',
        headers : {
            Authorization : `token ${req.user.githubAccessToken}`,
            'Content-Type' : 'application/json',
        },
        body : JSON.stringify({
            query,
            variables
        })
    });
    
    


    if(github_response.ok){
        const githubData = await github_response.json();
        const userData = githubData.data;
        const projectHealthStats = calculateProjectHealth(userData);

        //console.log("[backend] projectLiveRate:", projectHealthStats);
        redisClient.set(`gitshboard:stats:${req.user.githubId}:projectLiveRate`, JSON.stringify(projectHealthStats), {
            expiration: { type: 'EX', value: REDIS_DATA_EXPIRATION } // 5분 동안 유지
        });



        const responseData : CommonResponse<ProjectHealthStats> = {
            success : true,
            status : 200,
            data : projectHealthStats
        }

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
}