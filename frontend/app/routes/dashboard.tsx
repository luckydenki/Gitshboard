import { useEffect } from "react"



export default function Dashboard(){

    useEffect(()=>{

        const fetchUserData = async()=>{

            try{
                const res = await fetch("http://localhost:3000/api/users",
                    {
                        method : 'GET',
                        credentials : 'include'
                    }
                )

                if(res.ok){
                    const data = await res.json();
                    console.log("User data response:", data);
                }
                else{
                    throw new Error("Failed to fetch user data");
                }
            }catch(error){
                console.error("Error : Fetch user data error", error);
            }
        }

        fetchUserData();

    }, []);



    return (
        <div>
            <div className ="flex flex-col items-center justify-center min-h-screen">
            <h1>Dashboard</h1>
            <p>대시보드 페이지입니다.</p>
            </div>
        </div>
    )

}