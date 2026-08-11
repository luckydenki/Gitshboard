import { useQuery } from "@tanstack/react-query"
import { HTTPCredentials } from "dench-fetch"


export default function ContributePage() {

    const endTime = Date.now();
    const startTime = endTime - (30 * 24 * 60 * 60 * 1000); // 30일 전

    const from = new Date(startTime).toISOString();
    const to = new Date(endTime).toISOString();
    const params = new URLSearchParams({
        from: from,
        to: to
    });


    const { data, isLoading, isError} = useQuery({
        queryKey: ["contributeData"],
        queryFn: async() =>{
            const response = await fetch(`/api/contribute/commitActivity?${params.toString()}`,{
                method : 'GET',
                credentials : HTTPCredentials.INCLUDE,

            })

            const json = await response.json();
            if(response.ok){
                return json.data;
            }
            else{
                return json;
            }

        },
        staleTime : 5 * 60 * 1000, //5분,
        gcTime : 10 * 60 * 1000, //10분,    
    })


    console.log("contribute data", data);

    if(isLoading){
        return (
            <div> isLoading... </div>
        )
    }

    if(isError){
        return (
            <div> isError... </div>
        )
    }


    //커밋 활동 데이터를 그래프 형태로 보여줍니다.(기간에 대한 꺾은선 그래프)

    return (
        <div>
            <h1>Contribute Page</h1>
            <pre>
                {JSON.stringify(data, null, 2)}    
                
            </pre>
        </div>
    )


}