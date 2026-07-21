import {Router} from "express";
import { CommonErrorResponse, CommonResponse } from "../types/middlewares/common";
import { authToken, checkToken, checkUser } from "../middlewares/auth.middleware";
import { AuthRequest } from "../types/middlewares/auth";

const search_router = Router();


interface GithubUserSearchItem{
    login: string,
    id: number,
    avatar_url: string,
    html_url: string,
    type: string
}


interface GithubUserSearchResponse{
    total_count: number
    incomplete_results: boolean,
    items: Array<GithubUserSearchItem>
}

interface GithubSearchErrorResponse {
    message?: string;
    documentation_url?: string;
    status?: string;
    errors?: unknown[];
}


search_router.get("/", checkToken, checkUser, async(req : AuthRequest, res)=>{

    const query = req.query;
    const name = query.name as string;
    const page = query.page as string ?? "1";
    const per_page = query.per_page as string ?? "10"; 

    const params = new URLSearchParams({ q : name, page : page, per_page : per_page })

    let github_token : string |  undefined = undefined;

    if(req.state == 'success'){
        github_token = req.user?.githubAccessToken!
        console.log("이 요청은 인증 요청입니다.");
    }
    else{
        console.log("이 요청은 비인증 요청입니다.", github_token);
    }


    try{
        if(name === ""){
            throw {
                type : "",
                status : 500,
                title : "Invalid Parameter Value",
                detail : `Invalid search parameters : ${name}`
            }
        }

        console.log("params :", params.toString());

        const search_res = await fetch(`https://api.github.com/search/users?${params.toString()}`,
        {
            method : "GET",
            headers : {
                'Authorization' : `${github_token ? `token ${github_token}` : undefined}`
            }
        });

        
        if(search_res.ok){
            const data: GithubUserSearchResponse  = await search_res.json();

            data.items.forEach((e, idx)=>{
                const { id, avatar_url, html_url, login, type } = e;
                data.items[idx] = { id, avatar_url, html_url, login, type};
            })


            const toResponse : CommonResponse<GithubUserSearchResponse> = {
                status :  200,
                success : true,
                data : data
            }
            res.status(200).json(toResponse);
        }
        else{
            const data : GithubSearchErrorResponse =  await search_res.json();
            throw {
                type: data.documentation_url,
                status: data.status,
                title: `Failed to Github Search Request : ${name}`,
                detail : data.message ?? "Failed to get data from Github"
            }
        }

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
        else{
            errorResponse = error as CommonErrorResponse
        }

        res.status(500).json(
            errorResponse
        )
    }
})



export default search_router;