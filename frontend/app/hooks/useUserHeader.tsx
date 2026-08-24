import { useQuery } from "@tanstack/react-query"
import type { CommonErrorResponse } from "~/types/common/common";



export interface UserDataState{
    login : string,
    avatarUrl : string
}




export default function useUserHeader() {

    const { data, isLoading, isError, error } = useQuery<UserDataState, CommonErrorResponse>({
        queryKey: ["userheader"], 
        queryFn: async() =>{
                try {
                    const res = await fetch(`/api/users/userheader`,{
                        method : 'GET',
                        credentials : 'include'
                    })

                    const json = await res.json();
                    if(!res.ok) {
                        throw json;
                    }
                    
                    return json.data;
                } catch (error) {
                    if(error instanceof Error){
                        const errorResponse : CommonErrorResponse = {
                            status : 500,
                            title : 'Internal Server Error',
                            type : 'Internal Server Error',
                            detail : error.message,
                        }
                        throw errorResponse;
                    }
                    console.error("useUserHeader queryFn error:", error);
                    throw error;
                }
            }

    });


    return {
        data,
        isLoading,
        isError,
        error
    }


}