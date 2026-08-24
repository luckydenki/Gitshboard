import { useQuery } from "@tanstack/react-query"



export interface UserDataState{
    login : string,
    avatarUrl : string
}




export default function useUserHeader() {

    const { data, isLoading, isError} = useQuery<UserDataState>({
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
                    console.error("useUserHeader queryFn error:", error);
                    throw error;
                }
            }

    });


    return {
        data,
        isLoading,
        isError
    }


}