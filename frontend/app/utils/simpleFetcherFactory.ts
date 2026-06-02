import { ContentType,HTTPCredentials,HTTPHeaders, type FetchFactoryConfig } from "~/types/utils/simpleFetcher/simpleFetcher"
import simplefetch from "./simpleFetcher"


const fetchConfigPool : Record<string, FetchFactoryConfig  | null> = {};




export function fetchFactory(baseURL:string, headers?: Record<string,string>, credentials?: HTTPCredentials, timeout?: number) : FetchFactoryConfig {

    const get = async<T> (api:string) : Promise<T|null> =>{
        return await simplefetch<T>(`${baseURL}${api}`, {
            method : 'GET',
            headers,
            credentials,
        })
    }

    const post = async<T> (api:string, data:any, data_type? : ContentType) : Promise<T|null>=>{
        return await simplefetch<T>(`${baseURL}${api}`, {
            method : 'POST',
            headers : {
                ...headers,
                [HTTPHeaders.CONTENT_TYPE] : data_type || ContentType.BASIC
            },
            credentials,
            body : JSON.stringify(data),
        })
    }

    const put = async<T> (api:string, data:any, data_type? : ContentType) : Promise<T|null>=>{
        return await simplefetch<T>(`${baseURL}${api}`, {
            method : 'PUT',
            headers : {
                ...headers,
                [HTTPHeaders.CONTENT_TYPE] : data_type || ContentType.BASIC
            },
            credentials,
            body : JSON.stringify(data),
        })
    }

    const del = async<T> (api:string) : Promise<T|null>=>{
        return await simplefetch<T>(`${baseURL}${api}`, {
            method : 'DELETE',
            headers,
            credentials,
        })
    }

    
    const fetcherConfig: FetchFactoryConfig = {
        baseURL,
        headers,
        credentials,
        timeout,
        get,
        post,
        put,
        delete: del,
    }



    return fetcherConfig;
}
