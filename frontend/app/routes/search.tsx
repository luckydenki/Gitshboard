import { useSearchParams } from "react-router"




export default function Search() {

    const [searchParams, setSearchParams] = useSearchParams();

    const searchName = searchParams.get("search_name");

    console.log("Search page loaded with search_name:", searchName);

    return(
        <>
            
        </>
    )
}