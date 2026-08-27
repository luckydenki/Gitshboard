import { useQuery } from "@tanstack/react-query";
import type { QueryKeys } from "~/types/query-key-enum";


export type UseQueryParams<T, E> = Omit<Parameters<typeof useQuery<T, E>>[0], 'queryKey'>;

export default function useManageKeyQuery<T, E>(queryKey: QueryKeys[], queryConfig : UseQueryParams<T, E>){
    return useQuery<T, E>({
        queryKey,
        ...queryConfig
    });
}