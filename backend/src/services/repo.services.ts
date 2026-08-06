import { redisClient } from "../infra/redis/redisClient";
import redisRepository from "../repository/redis.repository";
import { GithubLanguageRepositoryNode, GithubRepoCommonResponse, GithubCommitTimeRepositoryNode, GithubProjectTopicsNode } from "../types/stat";
import { calculateLanguageStats, CommitStats, LanguageStat, calculateCommitStats, ProjectCategoryStat, calculateProjectCategories, calculateDeveloperProfile, DeveloperProfileStats, calculateProjectHealth, ProjectHealthStats } from "../utils/stat";


const REDIS_DATA_EXPIRATION = 300; // 5분 동안 유지

class RepoService {

    public getLanguages = async(githubId : number, githubUsername : string, githubAccessToken : string) => {
    
        const cachedData = await redisRepository.get<LanguageStat[]>(`gitshboard:stats:${githubId}:languages`);
        
        if(cachedData){
            console.log("Redis hit : languages");
            return cachedData;
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
                login : githubUsername      
            };

            const github_response = await fetch('https://api.github.com/graphql', {   
                method : 'POST',
                headers : {
                    'Authorization' : `token ${githubAccessToken}`,
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

                if(!redisRepository.set(`gitshboard:stats:${githubId}:languages`, languageStats, REDIS_DATA_EXPIRATION)){
                    throw new Error("Failed to set cache for languages");
                }

               return languageStats;
            }

        }catch(err){
            console.error("Failed to fetch repository languages:", err);
            return null;
        }
}



    public getCommitTime = async(githubId : number, githubUsername : string, githubAccessToken : string) => {
 //304 Not Modified 요청에 대한 대비
        const cachedData = await redisRepository.get<CommitStats>(`gitshboard:stats:${githubId}:commitTime`);

        //없을 경우 cachedData는 null임.
        if (cachedData) {
            console.log("Redis hit : commitTime");
            return cachedData;
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
            login: githubUsername
        }

        try {
            const github_response = await fetch('https://api.github.com/graphql', {
                method: 'POST',
                headers: {
                    'Authorization': `token ${githubAccessToken}`,
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

                if(!redisRepository.set(`gitshboard:stats:${githubId}:commitTime`, commitStats, REDIS_DATA_EXPIRATION)){
                    throw new Error("Failed to set cache for commit time");
                }

                return commitStats;
            }
            else {
                throw new Error(`GitHub API responded with status ${github_response.status}`);
            }


        } catch (err) {
            console.error("Failed to fetch commit time data:", err);
            return null;
        }
}


    public getProjectTopics = async(githubId : number, githubUsername : string, githubAccessToken : string) => {

        const cachedData = await redisRepository.get<ProjectCategoryStat[]>(`gitshboard:stats:${githubId}:projectTopics`);

        //없을 경우 cachedData는 null임.
        if (cachedData) {
            console.log("Redis hit : projectTopics");
            return cachedData;
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
            login: githubUsername
        }

        const github_response = await fetch("https://api.github.com/graphql", {
            method: 'POST',
            headers: {
                'Authorization': `token ${githubAccessToken}`,
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

            if(!redisRepository.set(`gitshboard:stats:${githubId}:projectTopics`, projectTopics, REDIS_DATA_EXPIRATION)){
                throw new Error("Failed to set cache for project topics");
            }

            return projectTopics;

        }
        else {
            console.error("Failed to fetch project topics from GitHub API");
            return null;
        }
}

    public getDevelopStats = async(githubId : number, githubUsername : string, githubAccessToken : string) => {


        //304 Not Modified 요청에 대한 대비
        const cachedData = await redisRepository.get<DeveloperProfileStats>(`gitshboard:stats:${githubId}:developStats`);

        //없을 경우 cachedData는 null임.
        if (cachedData) {
            console.log("Redis hit : developStats");
            return cachedData;
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
            login : githubUsername
        }

        const github_response = await fetch("https://api.github.com/graphql", {
            method : 'POST',
            headers : {
                'Authorization' : `token ${githubAccessToken}`,
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

            if(!redisRepository.set(`gitshboard:stats:${githubId}:developStats`, developerProfileStats, REDIS_DATA_EXPIRATION)){
                throw new Error("Failed to set cache for develop stats");
            }

            return developerProfileStats;
        }
        else{
            console.error("Failed to fetch develop stats from GitHub API");
            return null;
        }

}



    public getProjectLiveRate = async(githubId : number, githubUsername : string, githubAccessToken : string) => {
      //304 Not Modified 요청에 대한 대비
            const cachedData = await redisRepository.get<ProjectHealthStats>(`gitshboard:stats:${githubId}:projectLiveRate`);

            //없을 경우 cachedData는 null임.
            if (cachedData) {
                console.log("Redis hit : projectLiveRate");
                return cachedData;
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
                login : githubUsername
            }
    
            const github_response = await fetch("https://api.github.com/graphql", {
                method : 'POST',
                headers : {
                    Authorization : `token ${githubAccessToken}`,
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
                if(!redisRepository.set(`gitshboard:stats:${githubId}:projectLiveRate`, projectHealthStats, REDIS_DATA_EXPIRATION)){
                    throw new Error("Failed to set cache for project live rate");
                }

                return projectHealthStats;
            }   
            else{
                console.error("Failed to fetch project live rate from GitHub API");
                return null;
            }
}
}


const repoService = new RepoService();
export default repoService;