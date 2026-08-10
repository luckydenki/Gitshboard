import searchClient from "../client/search.client";


class SearchService {


    public search = async(state:  'success' | 'failed', name: string, page: string = "1", per_page: string = "10")=>{

            const params = new URLSearchParams({ q : name, page : page, per_page : per_page })
        
            let github_token : string |  undefined = undefined;
        
            if(state == 'success'){
                github_token = state == 'success' ? github_token : undefined;
                console.log(state == 'success' ? "이 요청은 인증 요청입니다." : "이 요청은 비인증 요청입니다.", github_token);
            }
        

            try{
                if(name === ""){
                    const errorResponse = {
                        type: "",
                        title: "Invalid Parameter Value",
                        status: 500,
                        detail: `Invalid search parameters : ${name}`
                    }
                    throw errorResponse;
                }
        
        
                const search_res = await searchClient.search(name, parseInt(page), parseInt(per_page), github_token)
                return search_res;
        
            }catch(error){
                console.error("Error : Github search failed", error);

                //Error 타입이면 CommonErrorResponse로 변환하여 throw
                //그 외에는 이미 CommonErrorResponse 타입으로 throw합니다.
                if(error instanceof Error){
                    const errorResponse = {
                        type: "",
                        title: error.name,
                        status: 500,
                        detail: error.message
                    }
                    throw errorResponse;
                }

                throw error;
            }
    }


}



const searchService = new SearchService();
export default searchService;