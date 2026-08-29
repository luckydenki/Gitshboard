import { parseYYMMDD } from '../utils/parseYYMMDD';
import { Request, Response } from 'express';
import CommonError from '../utils/common-error';
import ErrorSVG from '../render/ErrorSVG';
import readmeService from '../services/readme.services';


class ReadmeController {


    setUISize(width: number, height: number) {
        const newWidth = Math.max(Math.min(width, 1500), 200);
        const newHeight = Math.max(Math.min(height, 1500), 100);
        return { width: newWidth, height: newHeight };
    }


    setFromTo(reqFrom : string | undefined, reqTo : string | undefined) {
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


    isValidDate(from : string, to : string): boolean {
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
}


const readmeController = new ReadmeController();

export default readmeController;