import type { CommonErrorResponse } from "~/types/common/common";

export const formatHour = (hour: number) =>  {
    return `${String(hour).padStart(2, "0")}:00`;
}


export const statQueryFn = async(url :string)=>{
    try{
        const res = await fetch(url, {
            credentials: 'include',
        });

        const json = await res.json();
        if(!res.ok) throw json;

        return json.data;
    }
    catch (error) {
        console.error("queryFn error:", error);
        if(error instanceof Error){
            const errorResponse : CommonErrorResponse = {
                status : 500,
                title : 'Internal Server Error',
                type : 'Internal Server Error',
                detail : error.message,
            }

            throw errorResponse;
        }
        else{
            throw error;
        }
    }
}
