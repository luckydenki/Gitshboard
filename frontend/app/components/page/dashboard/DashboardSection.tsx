import type { GithubRepositoryResponse, GithubUser } from "~/types/GithubInfo"
import RepositoryList from "./RepositoryList"
import SideProfile from "./SideProfile"
import StatCard from "./StatCard"
import { Loading } from "../../design/Loading"
import { useNavigate } from "react-router"
import useErrorCallback from "~/hooks/useErrorCallback"
import { useDashboardData } from "~/hooks/pages/dashboard-hooks"

export interface DashboardSectionProps { 
    userDataState : GithubUser,
    // loading : boolean
}
        

export default function DashboardSection({ userDataState }: DashboardSectionProps){

    const navigate = useNavigate();

    const { data, isLoading, isError} = useDashboardData();
    

     useErrorCallback(isError, ()=>{
         navigate("/");
     })


    if (isLoading || userDataState === null) {
        return (
            <Loading/>
        );
    }
    else if(isError || data === undefined){
        return (
            <div className="flex h-full w-full items-center justify-center">
                <p className="text-lg font-semibold text-gray-950 dark:text-white">Error loading data. Please try again later.</p>
            </div>
        )
    }

    const reposDataState = data;

    
    return(
            <section className="mx-auto grid max-w-380 gap-8 px-6 py-10 not-sm:grid-cols-1 lg:grid-cols-[360px_minmax(0,1fr)] lg:px-8">
                     <SideProfile userDataState={userDataState} />
     
                     <main className="flex min-w-0 flex-col gap-8">
                         <aside className="rounded-[2.25rem] bg-white p-8 shadow-[0_30px_90px_rgba(15,23,42,0.10)] dark:bg-gray-900">
                             <div className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
                                 <div className="max-w-2xl">
                                     <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gray-400">
                                         GitHub Overview
                                     </p>
                                     <h1 className="mt-4 text-4xl font-semibold tracking-tight text-gray-950 dark:text-white md:text-5xl">
                                         {userDataState.name ?? userDataState.login}'s workspace
                                     </h1>
                                     <p className="mt-5 text-base leading-7 text-gray-500 dark:text-gray-400">
                                         Profile activity, repository scale, and account signals are arranged with more breathing room for quick scanning.
                                     </p>
                                 </div>
                                 <div className="rounded-3xl bg-[#eef4ff] px-6 py-5 text-right shadow-inner dark:bg-gray-800">
                                     <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-500 dark:text-gray-400">Account</p>
                                     <p className="mt-2 text-lg font-semibold text-gray-950 dark:text-white">@{userDataState.login}</p>
                                 </div>
                             </div>
                         </aside>
     
                         <section className="grid gap-5 md:grid-cols-3">
                             <StatCard label="Followers" value={userDataState.followers} caption="People watching your updates" />
                             <StatCard label="Following" value={userDataState.following} caption="Accounts in your network" />
                             <StatCard label="Repos" value={reposDataState.repos.length} caption="Repositories available here" />
                         </section>
     
                         <RepositoryList githubDataState={reposDataState} isLoading={isLoading} isError={isError} />
                     </main>
                 </section>
    )
}