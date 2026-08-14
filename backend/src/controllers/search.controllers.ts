import { AuthRequest } from '../types/middlewares/auth';
import { Response } from 'express';
import { CommonErrorResponse, CommonResponse } from '../types/middlewares/common';
import searchService from '../services/search.service';

interface GithubUserSearchItem {
    login: string,
    id: number,
    avatar_url: string,
    html_url: string,
    type: string
}


interface GithubUserSearchResponse {
    total_count: number
    incomplete_results: boolean,
    items: Array<GithubUserSearchItem>
}


class SearchController {

    public search = async(req : AuthRequest, res : Response)=>{
    const query = req.query;
    const name = query.q as string;
    const page = query.page as string ?? "1";
    const per_page = query.per_page as string ?? "10"; 
    const github_token = req.user?.githubAccessToken;
    console.log("searchController search() called with params : ", {name, page, per_page});

    try {

        const search_res = await searchService.search(req.state!, name, page, per_page, github_token);

        if(name === ""){
            throw {
                type : "",
                status : 500,
                title : "Invalid Parameter Value",
                detail : `Invalid search parameters : ${name}`
            }
        }

        const response : CommonResponse<GithubUserSearchResponse> = {
            status :  200,
            success : true,
            data : search_res as GithubUserSearchResponse
        }
        res.status(200).json(response);
        

    }catch(error){
        let errorResponse : CommonErrorResponse | undefined = undefined;

        if(error instanceof Error){
            console.log("에러메세지 :" ,error.message);
            errorResponse = {
                type : "",
                title : error.name,
                status : 500,
                detail : error.message
            }
        }

        res.status(500).json(
            errorResponse
        )
    }
}
}



const searchController = new SearchController();

export default searchController;