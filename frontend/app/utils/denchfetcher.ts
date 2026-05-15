import type { DenchConfig } from "~/types/utils/simpleFetcher/dench";


async function toFormData(res : Response) : Promise<FormData>{
    if (res instanceof Response && res.ok){
            return res.formData();
    }
    else{
        throw new Error(`API request failed: ${res}`);
    }
}

async function toJsonData<T>(res: Response): Promise<T> {
    if (res instanceof Response && res.ok) {
        return res.json() as unknown as T;
    }
    else {
        throw new Error(`API request failed: ${res}`);
    }
}


async function toObject<T>(res: Response): Promise<T> {
    if (res instanceof Response && res.ok) {
        return res as unknown as T;
    }
    else {
        throw new Error(`API request failed: ${res}`);
    }
}


export default async function denchfetcher<T>(url: string, config?: DenchConfig) :  Promise<Response> {

    let res : Response;
    let timeout : NodeJS.Timeout | undefined;

    if(config?.timeout && config.abortController){
        timeout  = setTimeout(()=>{
            config.abortController?.abort();  
        }, config.timeout);
    }
    else if(config?.timeout && !config.abortController){
        config.options.signal = AbortSignal.timeout(config.timeout);
    }

    try{
        res = await fetch(`${url}`, config?.options)
    }
    catch(error){
        throw error;
    }
    finally{
        clearTimeout(timeout);
    }


    return res;
}