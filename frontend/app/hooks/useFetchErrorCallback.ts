import { useEffect } from "react";


type ErrorCode = 404 | 500 | 401 | 403 | 400

type ErrorCallback = (() => void) | string;

type ErrorMap = Partial<Record<ErrorCode, ErrorCallback>>;

export default function useFetchErrorCallback(isError : boolean, errorCode : ErrorCode, errorMap : ErrorMap ) {
    useEffect(()=>{
        if(!isError) return;
            try{
            const callback = errorMap[errorCode];

            if(typeof callback === "string"){
                console.log(`Error ${errorCode} occurred: ${callback}`);
            }
            else if(typeof callback === "function"){
                callback();
            }
            else{
                console.log(`Error ${errorCode} occurred with no specific callback.`);
            }
        }catch(error){
            console.error("You don't make a callback for error code", errorCode, "Please check your error map configuration.", error);
        }
    }, [isError, errorCode, errorMap]);
}
