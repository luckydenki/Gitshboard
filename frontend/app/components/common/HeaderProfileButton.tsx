import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext, useRef } from "react";
import { DashboardContext } from "~/stores/dashboardContext";



export default function HeaderProfileButton({ data } : { data: { login: string; avatarUrl: string } | undefined }) {

    const dialog  = useRef<HTMLDialogElement>(null);
    const dashboardContext = useContext(DashboardContext);
    const queryClient = useQueryClient();
    const logoutMutation = useMutation({
        mutationFn : async () => {
            const res = await fetch("/api/auth/logout", {
                method: "POST",
                credentials: "include",
            });

            const data = await res.json();

            if(!res.ok) throw data;
            return data;
        },
        
        onSuccess : ()=>{
                dashboardContext?.setReRender(prev => !prev);
                queryClient.clear();    
                // clear는 queryClient.invalidateQueries()와 달리 
                // 캐시를 완전히 제거합니다. 따라서 로그아웃 후에 
                // 캐시된 데이터를 다시 가져오게 됩니다.

                alert("로그아웃 되었습니다.");
                dialog.current?.close();
        },

        onError : (error)=>{
            throw error;
        }

    })


    return(
        <div className="relative">
            <button 
                className={`flex w-32 
                    items-center gap-3 px-3 py-2
                    rounded-full bg-white shadow-[0_10px_30px_rgba(15,23,42,0.08)] 
                    dark:bg-gray-900
                    hover:ring-2 hover:ring-github-light transition-normal duration-150
                    `}
                onClick={() => {
                    if(dialog.current?.open) {
                        dialog.current?.close();
                        return;
                    }
                    else {
                        dialog.current?.show();
                    }
                }}
            >
                    <img
                        src={data?.avatarUrl}
                        alt="avatar"
                        fetchPriority="high"
                        className="h-8 w-8 rounded-full"
                    />
                    <span className="overflow-hidden text-sm font-medium text-gray-700 dark:text-gray-200 not-sm:hidden">{data?.login}</span>
            </button>

            <dialog 
                className={`absolute left-0 top-full mt-2 w-32 
                rounded-lg bg-white shadow-lg dark:bg-gray-900`} 
                ref={dialog}
     
                
                >

                <menu className={`
                        flex flex-col p-2 gap-2 text-center
                        [&>button]:hover:bg-gray-300
                    `}>
                    <button onClick={() => logoutMutation.mutate()}>Logout</button>
                </menu>
            </dialog>

        </div>
    )
}