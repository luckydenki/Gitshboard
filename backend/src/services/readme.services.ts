import { redisClient } from "../infra/redis/redisClient";
import { RenderCommitActivitySVG } from "../render/RenderCommitActivitySVG";
import CommonError from "../utils/common-error";
import contributionService from "./contribution.services";
import { getUISize, getISOFromTo, getDisplayFromTo, initParamsDate, isValidDateRange, readmeErrorHandler } from "../utils/readme.util";
import repoService from "./repo.services";
import RenderTechnologyDistributionSVG from "../render/RenderTechnologyDistributionSVG";
import RenderPreferredCommitTimeSVG from "../render/RenderPreferredCommitTimeSVG";
import RenderWeeklyActivitySVG from "../render/RenderWeeklyActivitySVG";
import redisRepository from "../repository/redis.repository";


//TODO : 테스트 시 참고 사항 - 서비스 종속성 : contributionService, repoService

class ReadmeService {

        public commitActivity =  async (githubUsername: string, reqWidth : number, reqHeight : number, paramsFrom : string | undefined, paramsTo : string | undefined) => {
        
            try {
                const { width, height } = getUISize(reqWidth, reqHeight);
                const { initFrom, initTo } =initParamsDate(paramsFrom, paramsTo);
                const { displayFrom, displayTo } = getDisplayFromTo(initFrom, initTo);
                const { isoFrom, isoTo } = getISOFromTo(initFrom, initTo, { fromHour: 0, toHour: 23 });

                if (!isValidDateRange(initFrom, initTo)) {
                    throw CommonError.create400Error("유효하지 않은 날짜 범위입니다.", "/api/readme/commit-activity.svg");
                }

                const redisKey = redisRepository.createRedisKey(githubUsername, "commitActivity", {
                    additionalKey : "svg",
                    from : initFrom,
                    to : initTo,
                    lastKey : `${width}x${height}`
                });
                //어차피 initFrom과 initTo는 YYYYMMDD 형식으로 들어옴
                const cachedData = await redisRepository.get<string>(redisKey);
                if (cachedData) {
                    console.log("Serving cached SVG for commit activity chart");
                    return cachedData;
                }

                const commitActivity = await contributionService.getCommitActivity(undefined, githubUsername, isoFrom, isoTo);
                if(!commitActivity){
                    throw CommonError.create500Error("커밋 활동 정보를 가져오는 데 실패했습니다.", "/api/readme/commit-activity.svg");
                }
                
                const svg = RenderCommitActivitySVG(commitActivity, displayFrom, displayTo, width, height);
                await redisRepository.setEx(redisKey, 60 * 60, svg); // 캐시 만료 시간: 1시간
                return svg;

            }catch(error){
                readmeErrorHandler(error);
            }
        }

        public techDistribution = async (githubUsername: string, reqWidth : number, reqHeight : number) => {
            
            const redisKey = redisRepository.createRedisKey(githubUsername, "techDistribution", {
                additionalKey : "svg",
                lastKey : `${reqWidth}x${reqHeight}`
            });

            const cachedData = await redisRepository.get<string>(redisKey);
            if (cachedData) {
                console.log("Serving cached SVG for tech distribution chart");
                return cachedData;
            }

            const languageStats = await repoService.getLanguages(githubUsername, undefined);
            if (!languageStats) {
                throw CommonError.create500Error("레포지토리 언어 사용량 정보를 가져오는 데 실패했습니다.", "/api/readme/tech-distribution.svg");
            }

            const svg = RenderTechnologyDistributionSVG(languageStats, reqWidth, reqHeight);
            await redisRepository.set<string>(redisKey, svg);
            return svg;
        }

        
        public preferredCommitTime = async (githubUsername: string, reqWidth : number, reqHeight : number) => {
            const redisKey = redisRepository.createRedisKey(githubUsername, "preferredCommitTime", {
                additionalKey : "svg",
                lastKey : `${reqWidth}x${reqHeight}`
            });
            
            const cachedData = await redisRepository.get<string>(redisKey);
            if (cachedData) {
                console.log("Serving cached SVG for preferred commit time chart");
                return cachedData;
            }

            const commitStats = await repoService.getCommitTime(githubUsername, undefined);
            if (!commitStats) {
                throw CommonError.create500Error("커밋 시간 정보를 가져오는 데 실패했습니다.", "/api/readme/preferred-commit-time.svg");
            }

            const svg = RenderPreferredCommitTimeSVG(commitStats, reqWidth, reqHeight);
            await redisRepository.set<string>(redisKey, svg);
            return svg;

        }


        public weeklyCommitActivity = async (githubUsername: string, reqWidth : number, reqHeight : number) => {
            const redisKey = redisRepository.createRedisKey(githubUsername, "weeklyCommitActivity", {
                additionalKey : "svg",
                lastKey : `${reqWidth}x${reqHeight}`
            });
            const cachedData = await redisRepository.get<string>(redisKey);
            if (cachedData) {
                console.log("Serving cached SVG for weekly commit activity chart");
                return cachedData;
            }

            const commitStats = await repoService.getCommitTime(githubUsername, undefined);

            if (!commitStats) {
                throw CommonError.create500Error("주간 커밋 활동 정보를 가져오는 데 실패했습니다.", "/api/readme/weekly-commit-activity.svg");
            }

            const svg = RenderWeeklyActivitySVG(commitStats, reqWidth, reqHeight);
            await redisRepository.set<string>(redisKey, svg);
            return svg;
        }

}


const readmeService = new ReadmeService();
export default readmeService;

