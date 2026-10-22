import { useCallback, useEffect, useRef } from "react";

type TDebounceCallback = (target: any, ...args: any[]) => void;

/**
 * 디바운스 훅입니다.
 *
 * 디바운스 함수가 반환되며, 이 함수는 `(target? :any, ...args:any[]) => void` 형태를 구성하고 있습니다.
 * 만약 특정 값을 바탕으로 디바운스의 호출을 제어하고 싶다면 첫번째 인자에 그 `target` 변수를 작성하십시오
 * 예를 들어 input 입력이 비어있을 경우 디바운스가 호출되지 않도록 하려면 `e.target.value` 를 첫번째 인자로 넣으면 됩니다.
 *
 * 콜백의 경우 `TDebounceCallback` 이며, 이 함수는 `target, ...args:any[]`를 파라미터로 가지고 있습니다.
 * 이는 반환 받은 `debounce` 함수를 호출 할 때 넣은 파라미터를 그대로 제공해줍니다.
 * 예를 들어
 *
 * ```js
 * debounce(e.target.value, a, b, c);
 * ```
 *
 * 라고 한다면, `useDebounce`의 `TDebounceCallback`이 될 메서드도 다음과 같이 작성이 가능합니다.
 *
 * ```js
 * useDebounce((target, a, b, c)=>{
 *  console.log("debounce logging : ", target, a, b, c);
 * }, 3000);
 *```
 *
 * @param callback type TDebounceCallback = (target: any, ...args: any[]) => void; 디바운스 종료시 호출 될 콜백을 작성합니다.
 * @param ms 디바운스가 호출 될 시간 초입니다. (ms 단위)
 * @returns 호출할 디바운스 함수
 *
 */
export default function useDebounce(callback: TDebounceCallback, ms: number) {
    const timeout_ref = useRef<NodeJS.Timeout>(null);

    const debounce = useCallback((target?: any, ...args: any[]) => {
        if (target == null || target == undefined || target == "") {
            return;
        }
        clearTimeout(timeout_ref.current!);
        timeout_ref.current = setTimeout(() => callback(target, ...args), ms);
    }, []);

    useEffect(() => {
        return () => clearTimeout(timeout_ref.current!);
    }, []);

    return debounce;
}
