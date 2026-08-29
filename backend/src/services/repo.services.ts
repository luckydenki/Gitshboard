import redisRepository from "../repository/redis.repository";
import githubRepoAPIClient from "../client/repo.client";
import { GithubLanguageRepositoryNode, GithubRepoCommonResponse, GithubCommitTimeRepositoryNode, GithubProjectTopicsNode, ProjectLiveRateNode } from "../types/stat";
import { calculateLanguageStats, CommitStats, LanguageStat, calculateCommitStats, ProjectCategoryStat, calculateProjectCategories, calculateDeveloperProfile, DeveloperProfileStats, calculateProjectHealth, ProjectHealthStats } from "../utils/stat";


const REDIS_DATA_EXPIRATION = 300; // 5분 동안 유지

const createRedisKey = (githubUsername: string, dataType: string) => {
    return `gitshboard:stats:${githubUsername}:${dataType}`;
};

class RepoService {



    public getLanguages = async( githubUsername : string, githubAccessToken : string | undefined) => {
    
        const cachedData = await redisRepository.get<LanguageStat[]>(createRedisKey(githubUsername, "languages"));
        
        if(cachedData){
            console.log("Redis hit : languages");
            return cachedData;
        }
        
        try{
            const userData : GithubRepoCommonResponse<GithubLanguageRepositoryNode> | null = await githubRepoAPIClient.getLanguages(githubUsername, githubAccessToken);
            if(!userData){
                throw new Error("Failed to fetch languages from GitHub API");
            }

            const languageStats = calculateLanguageStats(userData);
            const success = await redisRepository.set(createRedisKey(githubUsername, "languages"), languageStats, REDIS_DATA_EXPIRATION);

            if(!success){
                console.error("Failed to set cache for languages");
                //redis 가 실패해도 통계 데이터는 반환합니다.
            }
            return languageStats;

        } catch(err){
            console.error("Failed to fetch repository languages:", err);
            return null;
        }
    };


    public getCommitTime = async(githubUsername : string, githubAccessToken : string | undefined) => {

        const cachedData = await redisRepository.get<CommitStats>(createRedisKey(githubUsername, "commitTime"));

        //없을 경우 cachedData는 null임.
        if (cachedData) {
            console.log("Redis hit : commitTime");
            return cachedData;
        }


        try{
            const userData : GithubRepoCommonResponse<GithubCommitTimeRepositoryNode> | null = await githubRepoAPIClient.getCommitTime(githubUsername, githubAccessToken);
            if(!userData){
                throw new Error("Failed to fetch commit time from GitHub API");
            }

            const commitStats: CommitStats = calculateCommitStats(userData);
            const success = await redisRepository.set(createRedisKey(githubUsername, "commitTime"), commitStats, REDIS_DATA_EXPIRATION);
            if(!success){
                console.error("Failed to set cache for commit time");
                //redis 가 실패해도 통계 데이터는 반환합니다.
            }
            // console.log("[backend] commitStats:", commitStats);

            return commitStats;

        } catch (err) {
            console.error("Failed to fetch commit time data:", err);
            return null;
        }
    };


    public getProjectTopics = async(    githubUsername : string, githubAccessToken : string | undefined) => {

        const cachedData = await redisRepository.get<ProjectCategoryStat[]>(createRedisKey(githubUsername, "projectTopics"));

        //없을 경우 cachedData는 null임.
        if (cachedData) {
            console.log("Redis hit : projectTopics");
            return cachedData;
        }


        try{
            const userData : GithubRepoCommonResponse<GithubProjectTopicsNode> | null = await githubRepoAPIClient.getProjectTopics(githubUsername, githubAccessToken);
            if(!userData){
                throw new Error("Failed to fetch project topics from GitHub API");
            }
            const projectTopics: ProjectCategoryStat[] = calculateProjectCategories(userData);
            const success = await redisRepository.set(createRedisKey(githubUsername, "projectTopics"), projectTopics, REDIS_DATA_EXPIRATION);
            if(!success){
                throw new Error("Failed to set cache for project topics");
            }
            return projectTopics;

            
        }catch(err){
            console.error("Failed to fetch project topics:", err);
            return null;
        }
    };

    public getDevelopStats = async(githubUsername : string, githubAccessToken : string | undefined) => {


        //304 Not Modified 요청에 대한 대비
        const cachedData = await redisRepository.get<DeveloperProfileStats>(createRedisKey(githubUsername, "developStats"));

        //없을 경우 cachedData는 null임.
        if (cachedData) {
            console.log("Redis hit : developStats");
            return cachedData;
        }



        try{
            const userData : GithubRepoCommonResponse<GithubCommitTimeRepositoryNode & GithubLanguageRepositoryNode & GithubProjectTopicsNode> | null = await githubRepoAPIClient.getDevelopStats(githubUsername, githubAccessToken);
            if(!userData){
                throw new Error("Failed to fetch develop stats from GitHub API");
            }
            const developerProfileStats: DeveloperProfileStats = calculateDeveloperProfile(userData);
            const success = await redisRepository.set(createRedisKey(githubUsername, "developStats"), developerProfileStats, REDIS_DATA_EXPIRATION);

            if(!success){
                console.error("Failed to set cache for develop stats");
                //redis 가 실패해도 통계 데이터는 반환합니다.
            }

            return developerProfileStats;

        }catch(err){

            console.error("Failed to fetch develop stats:", err);
            return null;
        }
    };



    public getProjectLiveRate = async(githubUsername : string, githubAccessToken : string | undefined   ) => {
      //304 Not Modified 요청에 대한 대비
            const cachedData = await redisRepository.get<ProjectHealthStats>(createRedisKey(githubUsername, "projectLiveRate"));

            //없을 경우 cachedData는 null임.
            if (cachedData) {
                console.log("Redis hit : projectLiveRate");
                return cachedData;
            }
            
            try{
                const userData : GithubRepoCommonResponse<ProjectLiveRateNode> | null = await githubRepoAPIClient.getProjectLiveRate(githubUsername, githubAccessToken);
                if(!userData){
                    throw new Error("Failed to fetch project live rate from GitHub API");
                }

                const projectHealthStats = calculateProjectHealth(userData);
                const success = await redisRepository.set(createRedisKey(githubUsername , "projectLiveRate"), projectHealthStats, REDIS_DATA_EXPIRATION);
                if(!success){
                    console.error("Failed to set cache for project live rate");
                    //redis 가 실패해도 통계 데이터는 반환합니다.
                }

                return projectHealthStats;


            }catch(err){
                console.error("Failed to fetch project live rate:", err);
                return null;
            }
    };
}


const repoService = new RepoService();
export default repoService;