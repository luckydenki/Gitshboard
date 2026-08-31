import { AuthRequest } from "../types/middlewares/auth";
import { Response } from "express";
import { CommonErrorResponse, CommonResponse } from "../types/middlewares/common";
import { CommitStats, DeveloperProfileStats, LanguageStat, ProjectCategoryStat, ProjectHealthStats } from "../utils/stat";
import repoService from "../services/repo.services";



class RepoController {

    public languages = async (req : AuthRequest, res : Response) => {

        if(!req.user){
            const errorResponse : CommonErrorResponse = {
                type : "https://developer.github.com/v4",
                title : "Unauthorized",
                status : 401,
                detail : "인증된 사용자 정보가 없습니다.",
            }
            return res.status(401).json(errorResponse);
        }

        const data = await repoService.getLanguages(req.user.githubUsername, req.user.githubAccessToken);

        if(data){
            const responseData : CommonResponse<LanguageStat[]> = {
                success : true,
                status : 200,
                data : data
            }
            res.status(200).json(responseData);
        }
        else{
            const errorResponse : CommonErrorResponse = {
                type : "https://developer.github.com/v4",
                title : "GitHub API Error",
                status : 500,
                detail : "레포지토리 언어 사용량 정보를 가져오는 데 실패했습니다.",
            }
            res.status(500).json(errorResponse);
        }
    }



    public commitTime = async (req: AuthRequest, res : Response) => {

        if (!req.user) {
            const errorResponse : CommonErrorResponse = {
                type : "https://developer.github.com/v4",
                title : "Unauthorized",
                status : 401,
                detail : "인증된 사용자 정보가 없습니다.",
            }
            return res.status(401).json(errorResponse);
        }

        const commitTimeData = await repoService.getCommitTime(req.user.githubUsername, req.user.githubAccessToken);

        if(commitTimeData){
            const responseData: CommonResponse<CommitStats> = {
                success: true,
                status: 200,    
                data: commitTimeData
            }
            res.status(200).json(responseData);
        }
        else {
            const errorResponse: CommonErrorResponse = {
                type: "https://developer.github.com/v4",
                title: "GitHub API Error",
                status: 500,
                detail: "커밋 시간 정보를 가져오는 데 실패했습니다.",
            }
            res.status(500).json(errorResponse);
        }
    }


    public projectTopics = async (req: AuthRequest, res: Response) => {
        if (!req.user) {
            const errorResponse : CommonErrorResponse = {
                type : "https://developer.github.com/v4",
                title : "Unauthorized",
                status : 401,
                detail : "인증된 사용자 정보가 없습니다.",
            }
            return res.status(401).json(errorResponse);
        }

        const projectTopicsData = await repoService.getProjectTopics(req.user.githubUsername, req.user.githubAccessToken);

        if(projectTopicsData){
            const responseData: CommonResponse<ProjectCategoryStat[]> = {
                success: true,
                status: 200,
                data: projectTopicsData
            }
            res.status(200).json(responseData);
        }
        else{
            const errorResponse: CommonErrorResponse = {
                type: "https://developer.github.com/v4",
                title: "GitHub API Error",
                status: 500,
                detail: "프로젝트 토픽 정보를 가져오는 데 실패했습니다.",
            }
            res.status(500).json(errorResponse);
        }
    }



    public developStats =  async(req: AuthRequest, res : Response)=>{
        if(!req.user){
            const errorResponse : CommonErrorResponse = {
                type : "https://developer.github.com/v4",
                title : "Unauthorized",
                status : 401,
                detail : "인증된 사용자 정보가 없습니다.",
            }
            return res.status(401).json(errorResponse);
        }
        
        const developStatsData = await repoService.getDevelopStats(req.user.githubUsername, req.user.githubAccessToken);

        if(developStatsData){
            const responseData : CommonResponse<DeveloperProfileStats> = {
                success : true,
                status : 200,
                data : developStatsData
            }
            res.status(200).json(responseData);
        }
        else{
            const errorResponse : CommonErrorResponse = {
                type : "https://developer.github.com/v4",
                title : "GitHub API Error",
                status : 500,
                detail : "개발 통계 정보를 가져오는 데 실패했습니다.",
            }
            res.status(500).json(errorResponse);
        }
    }



    public projectLiveRate = async(req: AuthRequest, res :  Response)=>{

        if(!req.user){
            const errorResponse : CommonErrorResponse = {
                type : "https://developer.github.com/v4",
                title : "Unauthorized",
                status : 401,
                detail : "인증된 사용자 정보가 없습니다.",
            }

            return res.status(401).json(errorResponse);
        }

        const projectLiveRateData = await repoService.getProjectLiveRate(req.user.githubUsername, req.user.githubAccessToken);

        if(projectLiveRateData){
            const responseData : CommonResponse<ProjectHealthStats> = {
                success : true,
                status : 200,
                data : projectLiveRateData
            }
            res.status(200).json(responseData);
        }

        else{
            const errorResponse : CommonErrorResponse = {
                type : "https://developer.github.com/v4",
                title : "GitHub API Error",
                status : 500,
                detail : "프로젝트 활동률 정보를 가져오는 데 실패했습니다.",
            }
            res.status(500).json(errorResponse);
        }
    }
}


const repoController = new RepoController();
export default repoController;