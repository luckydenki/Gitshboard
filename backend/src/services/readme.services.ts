import { redisClient } from "../infra/redis/redisClient";
import { RenderCommitActivitySVG } from "../render/RenderCommitActivitySVG";
import CommonError from "../utils/common-error";
import { parseYYMMDD } from "../utils/parseYYMMDD";
import contributionService from "./contribution.services";




class ReadmeService {

        public setUISize(width: number, height: number) {
            const newWidth = Math.max(Math.min(width, 1500), 200);
            const newHeight = Math.max(Math.min(height, 1500), 100);
            return { width: newWidth, height: newHeight };
        }
    
    
        public setFromTo(reqFrom : string | undefined, reqTo : string | undefined) {
            const displayFrom = reqFrom ? parseYYMMDD(String(reqFrom)) : new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0];
            const displayTo = reqTo ? parseYYMMDD(String(reqTo)) : new Date().toISOString().split('T')[0];
            const from = new Date(new Date(displayFrom).setHours(0, 0, 0, 0)).toISOString();
            const to = new Date(new Date(displayTo).setHours(23, 59, 59, 999)).toISOString();
            const redisFrom = displayFrom.replace(/-/g, '');
            const redisTo = displayTo.replace(/-/g, '');
            console.log("displayFrom :", displayFrom, " displayTo :", displayTo);
            console.log("from :", from, " to :", to);
            return { displayFrom, displayTo, from, to, redisFrom, redisTo };
        }
    

        public isValidDate(from : string, to : string): boolean {
            const fromDate = new Date(from);
            const toDate = new Date(to);
    
            if (fromDate.getTime() > toDate.getTime()) {
                throw new CommonError({
                    status: 400,
                    title: "Bad Request",
                    type: "https://docs.github.com/en/graphql/overview/explorer",
                    detail: "The 'from' date must be earlier than the 'to' date.",
                    instance: "/graphql"
                });
            }
    
            else if(toDate.getTime() - fromDate.getTime() > 365 * 24 * 60 * 60 * 1000){
                throw new CommonError({
                    status: 400,
                    title: "Bad Request",
                    type: "https://docs.github.com/en/graphql/overview/explorer",
                    detail: "조회 기간은 1년 이내로 설정해 주세요",
                    instance: "/graphql"
                });
            }
    
            return !isNaN(fromDate.getTime()) && !isNaN(toDate.getTime());
        }



        public commitActivity =  async (githubUsername: string, reqWidth : number, reqHeight : number, reqFrom : string | undefined, reqTo : string | undefined) => {
        
            try {
                const { width, height } = this.setUISize(reqWidth, reqHeight);
                const { displayFrom, displayTo, from, to, redisFrom, redisTo } = this.setFromTo(reqFrom, reqTo);


                if (!this.isValidDate(from, to)) {
                    throw new CommonError({
                        status: 400,
                        title: "Bad Request",
                        type: "https://docs.github.com/en/graphql/overview/explorer",
                        detail: "Invalid date range.",
                        instance: "/api/readme/commit-activity.svg"
                    });
                }


                //redis 캐시키의 from to는 yyyymmdd만 사용한다.
                const cachedData = await redisClient.get(`commitActivity:${githubUsername}:svg:${redisFrom}${redisTo}:${width}x${height}`);
                if (cachedData) {
                    const svg = cachedData;
                    console.log("Serving cached SVG for commit activity chart");
                    return svg;
                }


                const commitActivity = await contributionService.getCommitActivity(undefined, githubUsername, from, to);
                const svg = RenderCommitActivitySVG(commitActivity, displayFrom, displayTo, width, height);

                redisClient.setEx(`commitActivity:${githubUsername}:svg:${redisFrom}${redisTo}:${width}x${height}`, 60 * 60, svg); // 캐시 만료 시간: 1시간
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