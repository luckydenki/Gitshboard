import { Request, Response } from 'express';
import CommonError from '../utils/common-error';
import ErrorSVG from '../render/ErrorSVG';
import readmeService from '../services/readme.services';
import repoService from '../services/repo.services';
import RenderTechnologyDistributionSVG from '../render/RenderTechnologyDistributionSVG';
import RenderPreferredCommitTimeSVG from '../render/RenderPreferredCommitTimeSVG';
import RenderWeeklyActivitySVG from '../render/RenderWeeklyActivitySVG';


class ReadmeController {

    public commitActivity = async (req: Request, res: Response) => {
        try {
            const username: string = String(req.query.username ?? "");
            const reqFrom = req.query.from as string | undefined;
            const reqTo = req.query.to as string | undefined;
            const reqWidth = Number(req.query.width ?? 900);
            const reqHeight = Number(req.query.height ?? 430);

            if (!username || username.trim() === "") {
                throw new CommonError({
                    status: 400,
                    title: "Bad Request",
                    type: "https://docs.github.com/en/graphql/overview/explorer",
                    detail: "Github에서 사용하는 유저 이름을 username 쿼리 파라미터로 전달해 주세요",
                    instance: "/api/readme/commit-activity.svg"
                });
            }

            const svg = await readmeService.commitActivity(username, reqWidth, reqHeight, reqFrom, reqTo);

            res.status(200).type('image/svg+xml').send(svg);
        }
        catch (err) {
            let commonError;

            if (err instanceof CommonError) {
                commonError = err;
            }
            else if (err instanceof Error) {
                commonError = new CommonError({
                    status: 500,
                    title: "Internal Server Error",
                    type: "https://docs.github.com/en/graphql/overview/explorer",
                    detail: err.message,
                    instance: "/api/readme/commit-activity.svg"
                });
            }
            else {
                commonError = new CommonError({
                    status: 500,
                    title: "Internal Server Error",
                    type: "https://docs.github.com/en/graphql/overview/explorer",
                    detail: "An unexpected error occurred",
                    instance: "/api/readme/commit-activity.svg"
                });
            }

            res.status(commonError.status).type('image/svg+xml').send(ErrorSVG(commonError, 900, 430));
        }
    }


    public techDistribution = async (req : Request, res : Response) => {
        try {

            const username: string = String(req.query.username ?? "");
            const reqWidth = Number(req.query.width ?? 900);
            const reqHeight = Number(req.query.height ?? 430);

            const languageStats = await repoService.getLanguages(username, undefined);

            if (!languageStats) {
                throw new CommonError({
                    status: 500,
                    title: "GitHub API Error",
                    type: "https://docs.github.com/en/graphql/overview/explorer",
                    detail: "레포지토리 언어 사용량 정보를 가져오는 데 실패했습니다.",
                });
            }

            const svg = RenderTechnologyDistributionSVG(languageStats, reqWidth, reqHeight);
            res.type('image/svg+xml').send(svg);
        } catch (error) {
            if (error instanceof CommonError) {
                res.status(error.status).type('image/svg+xml').send(ErrorSVG(error, 900, 430));
            }
            else if (error instanceof Error) {
                const commonError = new CommonError({
                    type: "https://docs.github.com/en/graphql/overview/explorer",
                    title: error.name,
                    status: 500,
                    detail: error.message
                });
                res.status(500).type('image/svg+xml').send(ErrorSVG(commonError, 900, 430));
            }
            else {
                const error = new CommonError({
                    type: "https://docs.github.com/en/graphql/overview/explorer",
                    title: "Unknown Error",
                    status: 500,
                    detail: "An unknown error occurred."
                });

                res.status(500).type('image/svg+xml').send(ErrorSVG(error, 900, 430));
            }
        }
    }

    public preferredCommitTime = async (req: Request, res: Response) => {
        try {
            const username: string = String(req.query.username ?? "");
            const reqWidth = Number(req.query.width ?? 900);
            const reqHeight = Number(req.query.height ?? 430);

            const data = await repoService.getCommitTime(username, undefined);

            if (!data) {
                throw new CommonError({
                    status: 500,
                    title: "GitHub API Error",
                    type: "https://docs.github.com/en/graphql/overview/explorer",
                    detail: "커밋 시간 정보를 가져오는 데 실패했습니다.",
                });
            }

            const svg = RenderPreferredCommitTimeSVG(data, reqWidth, reqHeight);
            res.type('image/svg+xml').send(svg);

        } catch (error) {
            if (error instanceof CommonError) {
                res.status(error.status).type('image/svg+xml').send(ErrorSVG(error, 900, 430));
            }
            else if (error instanceof Error) {
                const commonError = new CommonError({
                    type: "https://docs.github.com/en/graphql/overview/explorer",
                    title: error.name,
                    status: 500,
                    detail: error.message
                });
                res.status(500).type('image/svg+xml').send(ErrorSVG(commonError, 900, 430));
            }
            else {
                const error = new CommonError({
                    type: "https://docs.github.com/en/graphql/overview/explorer",
                    title: "Unknown Error",
                    status: 500,
                    detail: "An unknown error occurred."
                });
                res.status(500).type('image/svg+xml').send(ErrorSVG(error, 900, 430));
            }
        }
    }

    public weeklyActivity = async (req : Request, res : Response) => {
        try {
            const username: string = String(req.query.username ?? "");
            const reqWidth = Number(req.query.width ?? 900);
            const reqHeight = Number(req.query.height ?? 430);

            const data = await repoService.getCommitTime(username, undefined);

            if (!data) {
                throw new CommonError({
                    status: 500,
                    title: "GitHub API Error",
                    type: "https://docs.github.com/en/graphql/overview/explorer",
                    detail: "주간 커밋 활동 정보를 가져오는 데 실패했습니다.",
                });
            }

            const svg = RenderWeeklyActivitySVG(data, reqWidth, reqHeight);
            res.type('image/svg+xml').send(svg);

        }
        catch (error) {
            if (error instanceof CommonError) {
                res.status(error.status).type('image/svg+xml').send(ErrorSVG(error, 900, 430));
            }
            else if (error instanceof Error) {
                const commonError = new CommonError({
                    type: "https://docs.github.com/en/graphql/overview/explorer",
                    title: error.name,
                    status: 500,
                    detail: error.message
                });
                res.status(500).type('image/svg+xml').send(ErrorSVG(commonError, 900, 430));
            }
            else {
                const error = new CommonError({
                    type: "https://docs.github.com/en/graphql/overview/explorer",
                    title: "Unknown Error",
                    status: 500,
                    detail: "An unknown error occurred."
                });
                res.status(500).type('image/svg+xml').send(ErrorSVG(error, 900, 430));
            }
        }
    }


    public weeklyCommitActivity = async (req: Request, res: Response) => {
        try {
            const username: string = String(req.query.username ?? "");
            const reqWidth = Number(req.query.width ?? 900);
            const reqHeight = Number(req.query.height ?? 430);

            const data = await repoService.getCommitTime(username, undefined);

            if (!data) {
                throw new CommonError({
                    status: 500,
                    title: "GitHub API Error",
                    type: "https://docs.github.com/en/graphql/overview/explorer",
                    detail: "주간 커밋 활동 정보를 가져오는 데 실패했습니다.",
                });
            }

            const svg = RenderWeeklyActivitySVG(data, reqWidth, reqHeight);
            res.type('image/svg+xml').send(svg);

        }
        catch (error) {
            if (error instanceof CommonError) {
                res.status(error.status).type('image/svg+xml').send(ErrorSVG(error, 900, 430));
            }
            else if (error instanceof Error) {
                const commonError = new CommonError({
                    type: "https://docs.github.com/en/graphql/overview/explorer",
                    title: error.name,
                    status: 500,
                    detail: error.message
                });
                res.status(500).type('image/svg+xml').send(ErrorSVG(commonError, 900, 430));
            }
            else {
                const error = new CommonError({
                    type: "https://docs.github.com/en/graphql/overview/explorer",
                    title: "Unknown Error",
                    status: 500,
                    detail: "An unknown error occurred."
                });
                res.status(500).type('image/svg+xml').send(ErrorSVG(error, 900, 430));
            }
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