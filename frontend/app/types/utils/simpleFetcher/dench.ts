import type { HTTPCredentials } from "./simpleFetcher"

export interface DenchBaseConfig{
    baseURL : string,
    api : string,
    options : {
        method : string,
        credentials? : HTTPCredentials,
        signal? : AbortSignal,
        headers? : Record<string, string>
    },
}

export interface DenchConfig extends DenchBaseConfig{
    abortController?: AbortController,   
    timeout? : number;
}


export interface DenchBuilder<T>{
    config : DenchBaseConfig,
    errorCacllback : (params : any[]) => void,
    toResponse: () => Promise<Response>

}

export interface DenchCreateBuilder<T> extends DenchBuilder<T>{
    abort: () => DenchCreateBuilder<T>,
    auth: (token:string) => DenchCreateBuilder<T>,
    credientials: (credientials : HTTPCredentials) => DenchCreateBuilder<T>,
    cors: () => DenchCreateBuilder<T>,
    timeout: (ms : number) => DenchCreateBuilder<T>,

    

    toFormData: () => Promise<FormData>,
    toJson: () => Promise<T>,
    toObject: () => Promise<T>
}


export interface DenchGetBuilder<T> extends DenchBuilder<T>{
    abort: (controller : AbortController) => DenchGetBuilder<T>,
    auth: (token:string) => DenchGetBuilder<T>,
    timeout : (ms : number) => DenchGetBuilder<T>,
    credientials: (credientials : HTTPCredentials) => DenchGetBuilder<T>,

    toFormData: () => Promise<FormData>,
    toJson: () => Promise<T>,
    toObject: () => Promise<T>
}


export interface DenchInterface{
    baseURL : string,
    get : <T>(api:string) => DenchGetBuilder<T>
    post? : <T>(api: string, data : any) => DenchCreateBuilder<T>
    put? : <T>(api: string, data : any) => DenchCreateBuilder<T>
    delete? : <T>(api: string) => DenchGetBuilder<T>
}
