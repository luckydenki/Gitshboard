import { useQuery } from "@tanstack/react-query"
import ReactECharts from "echarts-for-react"
import { HTTPCredentials } from "dench-fetch"

export interface GithubCommitActivity {
    total : number,
    results : Array<{
        repositoryName : string,
        occuredAt : Array<string>,
        commitCount : Array<number>
    }>,
     commitOccuredAt : Array<string>,    // 모든 repository의 commit이 발생한 날짜를 합친 배열
    commitCounts : Array<number>        // 모든 repository의 commit이 발생한 날짜를 합친 배열에 대한 commitCount
}



export default function ContributePage() {

    const endTime = Date.now();
    const startTime = endTime - (30 * 24 * 60 * 60 * 1000); // 30일 전

    const from = new Date(startTime).toISOString();
    const to = new Date(endTime).toISOString();
    const params = new URLSearchParams({
        from: from,
        to: to
    });


    const { data, isLoading, isError} = useQuery<GithubCommitActivity>({
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
    //console.log("data.results2", data?.results2.get("2026-07-13"));

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


    const option = {
    xAxis: {
        type: "category",
        data: data?.results[0].occuredAt
    },
    yAxis: {
        type: "value",
    },
    series: [
        {
        type: "line",
        data: data?.results[0].commitCount
        },
    ],
    };


    const option2 = {
    xAxis: {
        type: "category",
        data: data?.commitOccuredAt
    },
    yAxis: {
        type: "value",
    },
    series: [
        {
        type: "line",
        data: data?.commitCounts
        },
    ],
    }



    //커밋 활동 데이터를 그래프 형태로 보여줍니다.(기간에 대한 꺾은선 그래프)

    return (
        <div className= "p-8">
            <h1 className={`flex 
                w-full h-40 items-center justify-center
                 bg-white text-4xl font-semibold
                 rounded-2xl shadow-2xl`}>Contribute Page</h1>

            <ReactECharts option={option} style={{ height: "400px", width: "100%" }}/>
                
      
            <ReactECharts option={option2} style={{ height: "400px", width: "100%" }}/>
        </div>
    )


}