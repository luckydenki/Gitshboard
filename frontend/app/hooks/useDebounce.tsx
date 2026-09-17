import { useCallback, useEffect, useRef } from "react";



type TDebounceCallback = (target:any, ...args : any[]) => void



export default function useDebounce(callback : TDebounceCallback, second : number){
     
    const timeout_ref = useRef<NodeJS.Timeout>(null);
    
    const debounce = useCallback((target? : any, ...args : any[])=>{
        if(target == null || target == undefined || target == ""){
            return;
        }
        clearTimeout(timeout_ref.current!);
        timeout_ref.current = setTimeout(()=>callback(target, ...args), second);        
    },[])

    useEffect(()=>{
        return ()=>clearTimeout(timeout_ref.current!);
    },[])


    return debounce;

}