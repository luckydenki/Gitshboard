


export default async function simpleFetcher<T>(url:string, config? : RequestInit) : Promise<T | null>{
    try{
        const res = await fetch(`${url}`,
            config ? config : {},
        )

        if(res.ok){
            const data = await res.json();
            return data as T;
        }
        else{
            throw new Error(`API request failed for ${url}: ${res.status} ${res.statusText}`,
                {
                    cause : {
                        status : res.status,
                        statusText : res.statusText
                    }
                }
            );
        }
    }
    catch(error){
        throw error;
    }
    

    return null;
}