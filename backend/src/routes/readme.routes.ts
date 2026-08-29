import { Router } from 'express';
import CommonError from '../utils/common-error';
import contributionService from '../services/contribution.services';

import { RenderCommitActivitySVG } from '../render/RenderCommitActivitySVG';
import { redisClient } from '../infra/redis/redisClient';
import ErrorSVG from '../render/ErrorSVG';



const readme_router = Router();


readme_router.get('/health', (req, res)=>{
    res.json({ message: 'Readme route is working!' });
})


readme_router.get('/', (req, res)=>{
    res.json({ message: 'Readme route is working!' });
});



// GET /api/readme/contribution.svg
readme_router.get('/commit-activity.svg', async (req, res)=>{
    try{
        const username: string = String(req.query.username ?? "");

        if(username === undefined || username.trim() === ""){
            const error = new CommonError({
                status: 400,
                title: "Bad Request",
                type: "https://docs.github.com/en/graphql/overview/explorer",
                detail: "Github에서 사용하는 유저 이름을 username 쿼리 파라미터로 전달해 주세요",
                instance: "/api/readme/commit-activity.svg"
            });
            throw error;
        }


        const width = Number(req.query.width ?? 900);
        const height = Number(req.query.height ?? 430);

        //to가 없는 경우 오늘 날짜로 지정하며, 시간은 정확히 23:59:59로 설정 (YYYY-MM-DD)
        //(YYYY-MM-DD)
        const to: string = String(req.query.to ?? new Date(new Date().setHours(23, 59, 59, 999)).toISOString());
        //from이 없는 경우 30일 전 날짜로 지정하며, 시간은 정확히 00:00:00로 설정 (YYYY-MM-DD)
        const from: string = String(req.query.from ?? new Date(new Date().setDate(new Date().getDate() - 30)).toISOString());



        //redis 캐시키의 from to는 yyyymmdd만 사용한다.
        const redisFrom = from.split("T")[0].replace(/-/g, '');
        const redisTo = to.split("T")[0].replace(/-/g, '');

        const cachedData = await redisClient.get(`commitActivity:${username}:svg:${redisFrom}${redisTo}:${width}x${height}`);
        if (cachedData) {
            const svg = cachedData;
            console.log("Serving cached SVG for commit activity chart");
            return res.status(200).type('image/svg+xml').send(svg);
        }

        
        const commitActivity = await contributionService.getCommitActivity(undefined, username, from, to);
        const svg = RenderCommitActivitySVG(commitActivity, width, height);
        
        redisClient.setEx(`commitActivity:${username}:svg:${redisFrom}${redisTo}:${width}x${height}`, 60 * 60, svg); // 캐시 만료 시간: 1시간

        res.status(200).type('image/svg+xml').send(svg);
    }
    catch(err){
        let commonError;


        if (err instanceof CommonError) {
            commonError = err;

            ErrorSVG(commonError, 900, 430); // 기본 크기 사용
            
            return res.status(commonError.status).type('image/svg+xml').send(ErrorSVG(commonError, 900, 430));
        }
        else if(err instanceof Error){
            commonError = new CommonError({
                status: 500,
                title: "Internal Server Error",
                type: "https://docs.github.com/en/graphql/overview/explorer",
                detail: err.message,
                instance: "/api/readme/commit-activity.svg"
            });
        }
        else{
            commonError = new CommonError({
                status: 500,
                title: "Internal Server Error",
                type: "https://docs.github.com/en/graphql/overview/explorer",
                detail: "An unexpected error occurred",
                instance: "/api/readme/commit-activity.svg"
            });
        }

        res.status(commonError.status).json(commonError);
    }
})



export default readme_router;
