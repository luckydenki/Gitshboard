import type { QueryClient } from "@tanstack/react-query";
import type { ChangeEvent } from "react";
import type { GithubUserSearchResponse } from "~/types/common/search";


export const handleSearchDebounce = async (keyword: string, queryClient: QueryClient) => {


    const urlParams = new URLSearchParams({
        name: keyword,
        per_page: "8"
    })


    // const res  = await fetch(`/api/search?${urlParams.toString()}`, {
    //     credentials : "include"
    // }).then(async(res)=>{
    //     return await res.json();
    // })
    // console.log("debounce res ", res);
    // const data = res.data;

    console.log("debounce keyword ", keyword);


    //이런 일반 메서드나 컴포넌트 최상위 스코프가 아닌 위치에서는 useQuery가 아니라 fetchQuery를 사용하세용
    const data = await queryClient.fetchQuery<GithubUserSearchResponse>({
        queryKey: ["search", keyword],
        queryFn: async () => {
            const res = await fetch(`/api/search?${urlParams.toString()}`, {
                credentials: "include"
            });

            const json = await res.json();
            if(!res.ok){
                throw json;
            }

            return json.data;
        },
        staleTime: 1000 * 60 * 0.5, //30초
        gcTime: 1000 * 60 * 2, //2분
        retry : 1
    });
    console.log("debounce res ", data);



    return data;
}



export const debounceExecute = async(start_time : React.RefObject<number>, e : ChangeEvent<HTMLInputElement, HTMLInputElement>, queryClient: QueryClient, setDebounceData: React.Dispatch<React.SetStateAction<GithubUserSearchResponse | undefined>>)=>{
            start_time.current = 0;
            const data = await handleSearchDebounce(e.target.value, queryClient);
            setDebounceData((prev)=>{
                if(data === prev){
                    console.log("같음, 아무래도 fetchQuery의 staleTime이 지나지 않아서 캐시된 동일한 참조의 객체를 반환한듯");
                }

                return data;
            });
    }


export const debounce = async (start_time: React.RefObject<number>, c : React.MutableRefObject<NodeJS.Timeout | null>, e : ChangeEvent<HTMLInputElement, HTMLInputElement>, queryClient: QueryClient, setDebounceData: React.Dispatch<React.SetStateAction<GithubUserSearchResponse | undefined>> )=> {
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
            start_time.current = 0;
            console.log("cacheData exists for key ", e.target.value, cacheData);
            setDebounceData(cacheData as GithubUserSearchResponse);
        }



        //단, debounce가 일어나는 최소 시간도 존재해야 함. 2.5초 이상 입력이 존재하면 알아서 api 실행
        if(Date.now()-start_time.current > 2500){
            console.log("??");
            debounceExecute(start_time, e, queryClient, setDebounceData);
            return;
        }

        c.current = setTimeout(async()=>{
            console.log("?!");
            debounceExecute(start_time, e, queryClient, setDebounceData);
        }, 1000)    
        //입력 종료 후 반드시 1초 이후에는 debounce가 실행됩니다.
        //1.5초 좀 느리게 느껴져서 줄임, 차후 사용자 테스트 하면서 함 검증 받아봐야 할듯
    }
