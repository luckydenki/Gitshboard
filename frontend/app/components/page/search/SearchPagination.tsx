import { useNavigate } from "react-router";



export default function SearchPagination({name, page, data, children } : {name: string, page: string, data: any, children: React.ReactNode}){


    const navigate = useNavigate();

    return(
        <footer className="flex self-center">
                    <button className={`w-12 
                        text-center
                        hover:bg-gray-400
                        not-sm:text-xs not-sm:w-8 not-sm:h-8
                        `}
                        onClick={()=>{
                            const searchParams = new URLSearchParams({
                                    name : name,
                                    page : Math.max(1,Number(page) - 10).toString(),
                                })

                            navigate(`/search?${searchParams.toString()}`)
                            console.log("뒤로가기")
                        }}
                        >
                        {"<"}
                    </button>
                    {children}
                     <button className={`w-12
                        text-center
                        hover:bg-gray-400
                        not-sm:text-xs not-sm:w-8 not-sm:h-8
                        `}
                        onClick={()=>{
                            const total_count = data?.total_count ?? 0;

                            const searchParams = new URLSearchParams({
                                name : name,
                                page : Math.min(total_count ,Number(page) + 10).toString(),
                            })

                            navigate(`/search?${searchParams.toString()}`)

                            console.log("앞으로가기")
                        }}
                        >
                        {">"}
                    </button>
                </footer>
    )

}