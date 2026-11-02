import type { DenchHTTPURL } from "dench-fetch";


export default function getBackendURL(): DenchHTTPURL{
    let backendURL = import.meta.env.VITE_BACKEND_URL;

    if(!backendURL || backendURL === ""){
        const where = import.meta.env.VITE_BACKEND_WHERE;

        if(where === "local"){
            backendURL = import.meta.env.VITE_BACKEND_LOCAL_URL;
        }
        else if(where === "prod"){
            backendURL = import.meta.env.VITE_BACKEND_PROD_URL;
        }
    }

    return backendURL;
}