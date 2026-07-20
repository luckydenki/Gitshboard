import { dench, DenchURLNormalizeMode } from "dench-fetch";
import getBackendURL from "~/utils/getBackendURL";
import { Log } from "~/utils/log_system/log";
import { useNavigate } from "react-router";


const handleSearchSubmit = (e: React.SubmitEvent<HTMLFormElement>, navigate: ReturnType<typeof useNavigate>)=>{
    e.preventDefault();

    console.log("Search button clicked ", e.currentTarget);
    const formData = new FormData(e.currentTarget);
    const searchName = formData.get("search_name")??"";

    if(searchName === ""){
        Log( "검색어가 비어있습니다. 검색을 진행하지 않습니다.");
        return;
    }
    else if(typeof searchName === "string"){
        Log( "검색어가 문자열입니다. 검색을 진행합니다. : "+ searchName);
        
        navigate("/search?name="+encodeURIComponent(searchName));
    }
    else{
        Log( "검색어가 문자열이 아닙니다.");
        throw new Error("검색어가 문자열이 아닙니다.");
    }

}


const SearchFormCss = {
    form : `flex flex-row
            w-full min-w-80 max-w-4xl pl-6 pr-2 py-1
            border rounded-full border-gray-300 bg-white shadow-md
            text-gray-950`,
    
    input : `flex-1 
            text-md
            focus:outline-none 
            not-sm:text-sm not-sm:h-12 
            dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-github-light dark:focus:ring-github-light/50 
            transition-all duration-200`,

    submit_button : `size-12 
            bg-github-light/50 rounded-full
            hover:ring-2 hover:ring-github-light hover:bg-github-light/60
            focus:outline-none focus:ring-2 focus:ring-gray-800
            not-sm:size-12
            transition-all duration-200`
}




export default function SearchForm(){
    const navigate = useNavigate();


    return(
         <form 
          action ="/search"
          className ={SearchFormCss.form}
          aria-label="Search for github users"
          onSubmit={(e)=>handleSearchSubmit(e, navigate)}
          >
            <input 
            type="text"
            className={SearchFormCss.input}
            placeholder="Search for users"
            name="search_name"
            />

            <button 
            type="submit" 
            className={SearchFormCss.submit_button}
            ></button>
          </form>
    )
}