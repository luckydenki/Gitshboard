import { redisClient } from "../infra/redis/redisClient";
import { RenderCommitActivitySVG } from "../render/RenderCommitActivitySVG";
import CommonError from "../utils/common-error";
import contributionService from "./contribution.services";
import { getUISize, getISOFromTo, getDisplayFromTo, initParamsDate, isValidDateRange } from "../utils/readme.util";
import { createRedisKey } from "../utils/redis.util";



class ReadmeService {


        public commitActivity =  async (githubUsername: string, reqWidth : number, reqHeight : number, paramsFrom : string | undefined, paramsTo : string | undefined) => {
        
            try {
                const { width, height } = getUISize(reqWidth, reqHeight);
                const { initFrom, initTo } =initParamsDate(paramsFrom, paramsTo);
                const { displayFrom, displayTo } = getDisplayFromTo(initFrom, initTo);
                const { isoFrom, isoTo } = getISOFromTo(initFrom, initTo, { fromHour: 0, toHour: 23 });

            
                if (!isValidDateRange(initFrom, initTo)) {
                    throw CommonError.create400Error("Invalid date", "/api/readme/commit-activity.svg");
                }

                const redisKey = createRedisKey(githubUsername, "commitActivity", {
                    additionalKey : "svg",
                    from : initFrom,
                    to : initTo,
                    lastKey : `${width}x${height}`
                });

                console.log(`Redis Key: ${redisKey}`);

                //어차피 initFrom과 initTo는 YYYYMMDD 형식으로 들어옴
                const cachedData = await redisClient.get(redisKey);
                if (cachedData) {
                    const svg = cachedData;
                    console.log("Serving cached SVG for commit activity chart");
                    return svg;
                }


                const commitActivity = await contributionService.getCommitActivity(undefined, githubUsername, isoFrom, isoTo);
                const svg = RenderCommitActivitySVG(commitActivity, displayFrom, displayTo, width, height);



                console.log(`Set Redis Key: ${redisKey}`);
                await redisClient.setEx(redisKey, 60 * 60, svg); // 캐시 만료 시간: 1시간
                return svg;

            }catch(error){

                if(error instanceof CommonError){
                    throw error;
                }
                else if(error instanceof Error){
                    throw new CommonError({
                        type: "https://docs.github.com/en/graphql/overview/explorer",
                        title: error.name,
                        status: 500,
                        detail: error.message
                    });
                }
                else{
                    throw new CommonError({
                        type: "https://docs.github.com/en/graphql/overview/explorer",
                        title: "Unknown Error",
                        status: 500,
                        detail: "An unknown error occurred."
                    });
                }
                


            }
        }


}


const readmeService = new ReadmeService();
export default readmeService;

