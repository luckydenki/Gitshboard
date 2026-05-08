import { useEffect, useState } from "react";



export default function useFetchAll<T extends any[]>( config? : RequestInit, ...api_url : string[]) : 
{ dataState : T | null, isLoading : boolean, isError : boolean}{

    const [dataState, setDataState] = useState<T | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isError, setIsError] = useState<boolean>(false);

    useEffect(()=>{
        const fetchData = async()=>{
            try{

                const req = api_url.map(async(url)=>{
                    const res = await fetch(`http://localhost:3000/${url}`,
                        config ? config : {}
                    )   
                    
                    if(!res.ok){
                        throw new Error(`API request failed for ${url}: ${res.status} ${res.statusText}`);
                    }

                    return res.json();
                })

                const data = await Promise.all(req);

                // const responses = await Promise.all(api_url.map(url => 
                //     fetch(`http://localhost:3000/${url}`,
                //         config ? config : {}
                //     )   
                // ));

                // if(responses.some(res => !res.ok)){
                //     console.error("One or more API requests failed:", responses);
                //     throw new Error("One or more API requests failed");
                // }

                // const data = await Promise.all(responses.map(res => res.json()));
                // if(data.length !== api_url.length){
                //     console.error("Fetched data length does not match API URL length");
                //     throw new Error("Fetched data length does not match API URL length");
                // }

                console.log("Fetched data:", data);

                setDataState(data as T);
                setIsLoading(false);

            } catch (error) {
                console.error("Error fetching data:", error);
                setIsError(true);
            } 
        }

        fetchData();
    }, []);



    return { dataState, isLoading, isError };
}

