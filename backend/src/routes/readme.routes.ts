import { Router } from 'express';
import readmeController from '../controllers/readme.controllers';
import CommonError from '../utils/common-error';
import ErrorSVG from '../render/ErrorSVG';
import repoService from '../services/repo.services';
import RenderTechnologyDistributionSVG from '../render/RenderTechnologyDistributionSVG';



const readme_router = Router();


readme_router.get('/health', (req, res)=>{
    res.json({ message: 'Readme route is working!' });
})


// GET /api/readme/contribution.svg
readme_router.get('/commit-activity.svg', readmeController.commitActivity);

readme_router.get('/tech-distribution.svg', async(req, res)=>{
    try{

        const username: string = String(req.query.username ?? "");
        const reqWidth = Number(req.query.width ?? 900);
        const reqHeight = Number(req.query.height ?? 430);

        const languageStats = await repoService.getLanguages(username, undefined);

        if(!languageStats){
            throw new CommonError({
                status: 500,
                title: "GitHub API Error",
                type: "https://docs.github.com/en/graphql/overview/explorer",
                detail: "레포지토리 언어 사용량 정보를 가져오는 데 실패했습니다.",
            });
        }

        const svg = RenderTechnologyDistributionSVG(languageStats, reqWidth, reqHeight);

        res.type('image/svg+xml').send(svg);


    }catch(error){
        if(error instanceof CommonError){
            res.status(error.status).type('image/svg+xml').send(ErrorSVG(error, 900, 430));
        }
        else if(error instanceof Error){
            const commonError = new CommonError({
                type: "https://docs.github.com/en/graphql/overview/explorer",
                title: error.name,
                status: 500,
                detail: error.message
            });
            res.status(500).type('image/svg+xml').send(ErrorSVG(commonError, 900, 430));
        }
        else{
            const error = new CommonError({
                type: "https://docs.github.com/en/graphql/overview/explorer",
                title: "Unknown Error",
                status: 500,
                detail: "An unknown error occurred."
            });

            res.status(500).type('image/svg+xml').send(ErrorSVG(error, 900, 430));
        }
    }
});


export default readme_router;
