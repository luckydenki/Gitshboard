import { CommonErrorResponse, ErrorStatus } from "../types/middlewares/common";

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

interface GithubSearchErrorResponse {
    message?: string;
    documentation_url?: string;
    status?: ErrorStatus;
    errors?: unknown[];
}



class SearchClient {


    public search = async(name : string, page : number, per_page : number, github_token?: string) : Promise<GithubUserSearchResponse> => {

        try{
            const params = new URLSearchParams({ q: name, page: page.toString(), per_page: per_page.toString() });
            const search_res = await fetch(`https://api.github.com/search/users?${params.toString()}`,
                {
                    method: "GET",
                    headers: {
                        'Authorization': `${github_token ? `token ${github_token}` : undefined}`
                    }
                });



            if (search_res.ok) {
                const data: GithubUserSearchResponse = await search_res.json();

                data.items.forEach((e, idx) => {
                    const { id, avatar_url, html_url, login, type } = e;
                    data.items[idx] = { id, avatar_url, html_url, login, type };
                })

                return data;
            }
            else {
                const data: GithubSearchErrorResponse = await search_res.json();

                const errorResponse : CommonErrorResponse = {
                    type: data.documentation_url ?? "https://docs.github.com/en/rest/search?apiVersion=2022-11-28",
                    title: `Failed to GitHub Search Request : ${name}`,
                    status: data.status ?? 500,
                    detail: data.message ?? "Failed to get data from Github"
                }
                
                throw errorResponse;
            }
                
        }
        catch(error){
            console.error("Error : Github search failed", error);
            throw error;
        }

    }



}



const searchClient = new SearchClient();
export default searchClient;