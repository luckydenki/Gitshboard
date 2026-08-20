import {  useRef, useState } from "react";
import { Navigate} from "react-router";


const navigateMap = new Map<string, number>();

const storedNavigateMap = sessionStorage.getItem("navigateMap");

if(storedNavigateMap){
    const parsedMap = new Map<string, number>(JSON.parse(storedNavigateMap));
    parsedMap.forEach((value, key) => {
        navigateMap.set(key, value);
    });
}


export function NavigateProxy({ to, replace = false }: { to: string; replace?: boolean }) {

    const [rerender, setRerender] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    clearTimeout(timeoutRef.current!);



    if(navigateMap.has(to)){
        console.log(navigateMap.get(to));
        navigateMap.set(to, navigateMap.get(to)! + 1);
    }
    else{
        navigateMap.set(to, 1);
    }

    sessionStorage.setItem("navigateMap", JSON.stringify(Array.from(navigateMap.entries())));

    timeoutRef.current = setTimeout(() => {
        console.log("삭제");
        navigateMap.delete(to);
        sessionStorage.setItem("navigateMap", JSON.stringify(Array.from(navigateMap.entries())));
        clearTimeout(timeoutRef.current!);
    }, 3000); // 3초 후에 navigateMap에서 해당 경로를 제거하여 메모리 누수 방지
    


    if(navigateMap.get(to)! >= 10){
        console.warn("과도한 navigate 호출이 감지되었습니다 ");
        const timeout = setTimeout(() => {
        navigateMap.delete(to);
        sessionStorage.setItem("navigateMap", JSON.stringify(Array.from(navigateMap.entries())));
        clearTimeout(timeout);
        console.log("NavigateProxy: navigateMap exceeded 10 for", to, "removing from map.");
        setRerender(!rerender); // 강제로 리렌더링하여 Navigate를 다시 시도
    }, 2000); // 2초 후에 navigateMap에서 해당 경로를 제거하여 메모리 누수 방지
        return <Navigate to="/error" replace={true} />;
    }

    return <Navigate to={to} replace={replace} />;

}