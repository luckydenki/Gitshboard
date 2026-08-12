import { useRef } from "react";
import { useNavigate } from "react-router";





export default function HeaderProfileButton({ data } : { data: { login: string; avatarUrl: string } | undefined }) {

    const dialog  = useRef<HTMLDialogElement>(null);
    const navigation = useNavigate();

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
                    <a href="/profile">Profile</a>
                    <button onClick={async() => {
                        alert("로그아웃 되었습니다.");
                        fetch("api/auth/logout",{
                            method: "POST",
                            credentials: "include"
                        });
                        navigation("/");
                    }}>Logout</button>
                </menu>
            </dialog>

        </div>
    )
}