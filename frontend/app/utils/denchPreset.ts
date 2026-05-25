import type { DenchConfig, DenchInterface } from "~/types/utils/simpleFetcher/dench";
import { HTTPCredentials } from "~/types/utils/simpleFetcher/simpleFetcher";


function deepFreezeConfig(config : DenchConfig) : DenchConfig{

    const frozenOptions = Object.freeze({
        ...config.options,
        headers : config.options.headers ? Object.freeze(config.options.headers) : undefined
    });

    return Object.freeze({
        ...config,
        options : frozenOptions
    });
}


export enum DenchDefaultPresets{
    GET_JSON = "getJson",
    GET_AUTH_JSON = "getAuthJson",
    GET_COOKIES_JSON = "getCookiesJson",
    GET_FORMDATA = "getFormData",
    GET_AUTH_FORMDATA = "getAuthFormData"
}



export const createDenchPresets = (type : string, baseURL : string, api? : string, token? : string) : Readonly<DenchConfig> => {

    const commonConfig : Omit<DenchConfig, "options">={
        baseURL,
        api : api || ""
    }

    interface createConfigParams{
        auth? : string,
        acceptType? : string,
        credientials? : HTTPCredentials
    }


    const createConfig = (params : createConfigParams) :DenchConfig => {
        const { auth, acceptType, credientials } = params;
        return {
            ...commonConfig,
            options : {
                method : "GET",
                headers : {
                    //스프레드 조건문 구문을 사용하면 조건적 레코드 설정이 가능합니다.
                    ...(acceptType ? { Accept: acceptType } : {}),
                    ...(auth ? { Authorization: `Bearer ${auth}` } : {})
                },
                ...(credientials ? { credentials : credientials } : {})
            }
        }
    }


    const presets : Record<string, DenchConfig> ={
        getJson : {
            ...createConfig({ acceptType: "application/json" })
        },
        getAuthJson:{
            ...createConfig({ auth: token, acceptType: "application/json" })
        },
        getCookiesJson:{
            ...createConfig({ credientials: HTTPCredentials.INCLUDE, acceptType: "application/json" })
        },
        getFormData : {
            ...createConfig({ acceptType: "multipart/form-data" })
        },
        getAuthFormData : {
            ...createConfig({ auth: token, acceptType: "multipart/form-data" })
        }
        

    }

    const preset = presets[type];


    return deepFreezeConfig(preset);
}
