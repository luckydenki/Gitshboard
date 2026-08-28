import { useQuery } from "@tanstack/react-query";
import type { QueryKeys } from "~/types/query-key-enum";
import type CommonError from "~/utils/common-error";


export type UseQueryParams<T, E> = Omit<Parameters<typeof useQuery<T, E>>[0], 'queryKey'>;

export default function useManagedKeyQuery<T, E = CommonError>(queryKey: QueryKeys[] | [QueryKeys, ...string[]], queryConfig : UseQueryParams<T, E>){
    return useQuery<T, E>({
        queryKey,
        ...queryConfig
    });
}