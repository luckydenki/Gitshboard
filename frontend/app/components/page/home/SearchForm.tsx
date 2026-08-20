
import { Log } from "~/utils/log_system/log";
import { useNavigate } from "react-router";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { GoSearch } from "react-icons/go";
import type { GithubUserSearchResponse } from "~/types/common/search";
import { QueryClient,useQueryClient } from "@tanstack/react-query";


const handleSearchSubmit = (e: React.SubmitEvent<HTMLFormElement>, navigate: ReturnType<typeof useNavigate>)=>{
    e.preventDefault();

    console.log("Search button clicked ", e.currentTarget);
    const formData = new FormData(e.currentTarget);
    const searchName = formData.get("search_name")??"";

    if(searchName === ""){
        Log( "검색어가 비어있습니다. 검색을 진행하지 않습니다.");
        return;
    }
    else if(typeof searchName === "string"){
        Log( "검색어가 문자열입니다. 검색을 진행합니다. : "+ searchName);
        
        navigate("/search?name="+encodeURIComponent(searchName));
    }
    else{
        Log( "검색어가 문자열이 아닙니다.");
        throw new Error("검색어가 문자열이 아닙니다.");
    }

}







const SearchFormCss = {
    form : `flex flex-row
            w-full min-w-80 max-w-4xl pl-6 pr-2 py-1
            border rounded-full border-gray-300 bg-white shadow-md
            text-gray-950`,
    
    input : `flex-1
            text-md
            focus:outline-none 
            not-sm:text-sm not-sm:h-12 
            dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-github-light dark:focus:ring-github-light/50 
            transition-all duration-200`,

    submit_button : ` flex items-center justify-center size-12 
            bg-github-light/50 rounded-full
            hover:ring-2 hover:ring-github-light hover:bg-github-light/60
            focus:outline-none focus:ring-2 focus:ring-gray-800
            not-sm:size-12
            transition-all duration-200`
}




/**
 * fetchSearchData 요구사항
 *
 * 1. GitHub public Search API를 우선 호출한다.
 *
 * 2. public API가 성공하면 데이터를 반환한다.
 *
 * 3. public API의 rate limit이 소진되었다면
 *    credentials: "include"로 백엔드 인증 API를 호출한다.
 *
 * 4. public API가 rate limit 이외의 원인으로 실패하면
 *    백엔드를 호출하지 않고 즉시 throw한다.
 *
 * 5. fallback 백엔드 요청도 실패하면 throw한다.
 * @param urlParams 
 * @returns 
 */

export const fetchSearchData = async(urlParams: URLSearchParams) : Promise<GithubUserSearchResponse> =>{

         try{
            // 1. 우선 public Search API를 호출한다.
            const search_res = await fetch(`https://api.github.com/search/users?${urlParams.toString()}`,
                     {
                        method: "GET",
                     })


            //console.log([...search_res.headers.entries()]);
            // 정상 응답이면 그냥 그 데이터 반환함.
            if(search_res.ok){
                const data = await search_res.json();
                console.log("search res :", data);
                return data;
            }

            // public API가 rate limit 소진 이유로 api가 실패한게 아니라면 그 즉시 에러를 반환한다.
            else if(!search_res.ok && search_res.status !== 429 && search_res.status !== 403){
                throw new Error("검색 api에 문제가 발생했습니다. " + search_res.status);
            }


            //인증 사용자도 아니면서 public API rate limit이 소진되었다면, 그대로 throw이고
            //인증 사용자라면 그 토큰을 이용해 백엔드 Search API를 호출한다.
            const search_auth_res  = await fetch(`/api/search?${urlParams.toString()}`, {
                credentials : "include"
            })

            if(search_auth_res.ok){
                const json = await search_auth_res.json();
                console.log("search auth res :", json);
                return json.data;
            }
            else if(search_auth_res.status === 429 || search_auth_res.status === 403){
                throw new Error("모든 API rate limit 이 소진되었습니다. 1분뒤에 다시 시도해주세요.");
            }
            else{
                throw new Error("백엔드 인증 API에 문제가 발생했습니다. " + search_auth_res.status);
            }

        }
         catch(error){
             console.error("Error : Github search failed", error);
             throw error; // re-throw the error to propagate it to the caller
        }


}




const handleSearchDebounce = async(keyword : string, queryClient : QueryClient) =>{
    const urlParams = new URLSearchParams({
        q : keyword,
        per_page : "8"
    })

    // tanstack query
    //이런 일반 메서드나 컴포넌트 최상위 스코프가 아닌 위치에서는 useQuery가 아니라 fetchQuery를 사용하세용
        const data = await queryClient.fetchQuery<GithubUserSearchResponse>({
            queryKey : ["search", keyword],
            queryFn : async()=>{

                const res = await fetchSearchData(urlParams);
                return res;
            },
            staleTime : 1000 * 60 * 0.5, //30초
            gcTime : 1000 * 60 * 2, //2분
        });
        console.log("debounce res ", data);


        return data;
    }





export default function SearchForm({Customform, CustomInput, CustomButton} : {Customform? : string, CustomInput? : string, CustomButton? :string}){
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const form = useRef<HTMLFormElement>(null);
    const input = useRef<HTMLInputElement>(null);
    const [debounce_data, setDebounceData] = useState<GithubUserSearchResponse>();
    const queryClient = useQueryClient();
    let c = useRef<NodeJS.Timeout>(null);
    const start_time = useRef(0);

    //console.log("재렌더");


    const debounceExecute = async(e : ChangeEvent<HTMLInputElement, HTMLInputElement>)=>{
            start_time.current = 0;
            const data = await handleSearchDebounce(e.target.value, queryClient);
            setDebounceData(data);
    }


    const debounce = async(e : ChangeEvent<HTMLInputElement, HTMLInputElement> )=> {
        clearTimeout(c.current!);

        // 데이터가 비어있거나 undefined이면 return
        if(e.target.value === "" || e.target.value === undefined){
            setDebounceData(undefined)
            return;
        }


        // 입력이 시작된 시간을 기록합니다. 단, 이미 기록되어 있으면 기록하지 않습니다.
        if(start_time.current === 0){
            start_time.current = Date.now();
        }

        const cacheData = queryClient.getQueryData(["search", e.target.value]);
        //우선 입력의 key값이 이미 queryClient에 존재하는지 검증
        if(cacheData){
            //console.log("cacheData exists for key ", e.target.value, cacheData);
            setDebounceData(cacheData as GithubUserSearchResponse);
        }


        /* 최소 시간 디바운스
        //단, debounce가 일어나는 최소 시간도 존재해야 함. 1.5초 이상 입력이 존재하면 알아서 api 실행
        if(Date.now()-start_time.current > 1500){;
            debounceExecute(e);
            return;
        }

        */

        c.current = setTimeout(async()=>{
            debounceExecute(e);
        }, 500)    
        //입력 종료 후 반드시 0.5초 이후에는 debounce가 실행됩니다.
        //1.5초 좀 느리게 느껴져서 줄임, 차후 사용자 테스트 하면서 함 검증 받아봐야 할듯
    }


    useEffect(()=>{
        return(()=>{
            clearTimeout(c.current!);
        })
    },[])

   // console.log("items ", debounce_data?.items);

    return(
        <div className="relative flex flex-col w-full min-w-80 max-w-200 justify-center items-center">

         <form 
          ref={form}
          action ="/search"
          className ={Customform ? Customform : SearchFormCss.form}
          aria-label="Search for github users"
          onSubmit={(e)=>handleSearchSubmit(e, navigate)}
          >

            <input 
            ref={input}
            aria-label="Search for github users input field"
            type="text"
            className={CustomInput ? CustomInput :SearchFormCss.input}
            placeholder="Search for users"
            name="search_name"
            onFocus={()=>{
                setIsVisible(true);
            }}
            onBlur={()=>{
                setIsVisible(false);
            }}
            onChange={
                debounce
            }>
            </input>
            

            <button 
            type="submit" 
            aria-label="Search users"
            className={CustomButton ? CustomButton : SearchFormCss.submit_button }
            >
                <GoSearch/>
            </button>
            {/* 
                해당 버튼과 인풋 필드는 UI를 설명할 텍스트가 없기 때문에 aria-label을 사용함
                aria-hidden를 사용하여 스크린 리더가 버튼을 (아이콘 까지 중복으로 읽는 것을) 무시하도록 함
            */}
        </form>

        <div className={`absolute top-full
            flex-col w-full gap-1 item px-2 bg-white max-h-80 overflow-y-scroll
            ${isVisible ? `flex` : `hidden` }
            `}>
            {
                debounce_data?.items.map((e, idx)=>
                    <button className= {`flex justify-between py-1 border-b border-github-light/50 
                        hover:bg-gray-400/50`}
                            key={idx}        
                            onMouseDown={(btn)=>{
                            btn.preventDefault();
                            input!.current!.value = e.login
                        }}
                    >
                        <img src={e.avatar_url} alt={`${e.login}'s avatar`} width="50" height="50"/>
                        <span> 
                            {e.login}
                        </span>
                    </button>
                ) 
            }
        
               
            
        </div>

        </div>

    )
}
