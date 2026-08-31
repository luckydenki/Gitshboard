import { Request, Response } from 'express';
import CommonError from '../utils/common-error';
import ErrorSVG from '../render/ErrorSVG';
import readmeService from '../services/readme.services';
import { readmeErrorResponseHandler } from '../utils/readme.util';


class ReadmeController {

    public commitActivity = async (req: Request, res: Response) => {
        try {
            const username: string = String(req.query.username ?? "");
            const reqFrom = req.query.from as string | undefined;
            const reqTo = req.query.to as string | undefined;
            const reqWidth = Number(req.query.width ?? 900);
            const reqHeight = Number(req.query.height ?? 430);

            if (!username || username.trim() === "") {
                throw CommonError.create400Error("Github에서 사용하는 유저 이름을 username 쿼리 파라미터로 전달해 주세요", "/api/readme/commit-activity.svg");
            }
            const svg = await readmeService.commitActivity(username, reqWidth, reqHeight, reqFrom, reqTo);
            res.status(200).type('image/svg+xml').send(svg);
        }
        catch (err) {
            readmeErrorResponseHandler(err, res);
        }
    }


    public techDistribution = async (req : Request, res : Response) => {
        try {
            const username: string = String(req.query.username ?? "");
            const reqWidth = Number(req.query.width ?? 900);
            const reqHeight = Number(req.query.height ?? 430);

            if (!username || username.trim() === "") {
                throw CommonError.create400Error("Github에서 사용하는 유저 이름을 username 쿼리 파라미터로 전달해 주세요", "/api/readme/tech-distribution.svg");
            }

            const svg = await readmeService.techDistribution(username, reqWidth, reqHeight);
            res.status(200).type('image/svg+xml').send(svg);

        } catch (error) {
            readmeErrorResponseHandler(error, res);
        }
    }
    

    public preferredCommitTime = async (req: Request, res: Response) => {
        try {
            const username: string = String(req.query.username ?? "");
            const reqWidth = Number(req.query.width ?? 900);
            const reqHeight = Number(req.query.height ?? 430);

            if (!username || username.trim() === "") {
                throw CommonError.create400Error("Github에서 사용하는 유저 이름을 username 쿼리 파라미터로 전달해 주세요", "/api/readme/preferred-commit-time.svg");
            }

            const svg = await readmeService.preferredCommitTime(username, reqWidth, reqHeight);
            res.status(200).type('image/svg+xml').send(svg);

        } catch (error) {
            readmeErrorResponseHandler(error, res);
        }
    }
    
    public weeklyCommitActivity = async (req: Request, res: Response) => {
        try {
            const username: string = String(req.query.username ?? "");
            const reqWidth = Number(req.query.width ?? 900);
            const reqHeight = Number(req.query.height ?? 430);

            if (!username || username.trim() === "") {
                throw CommonError.create400Error("Github에서 사용하는 유저 이름을 username 쿼리 파라미터로 전달해 주세요", "/api/readme/weekly-commit-activity.svg");
            }

            
            const svg = await readmeService.weeklyCommitActivity(username, reqWidth, reqHeight);

            res.status(200).type('image/svg+xml').send(svg);
        }
        catch (error) {
            readmeErrorResponseHandler(error, res);
        }
    }
    


    public notFound = (req: Request, res: Response) => {
        const error = new CommonError({
            status: 404,
            title: "Not Found",
            type: "https://docs.github.com/en/graphql/overview/explorer",
            detail: "요청하신 API를 찾을 수 없습니다.",
        });
        res.status(404).type('image/svg+xml').send(ErrorSVG(error, 900, 430));
    }
            

}


const readmeController = new ReadmeController();

export default readmeController;