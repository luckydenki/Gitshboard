
import { Log } from "~/utils/log_system/log";
import { useNavigate } from "react-router";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import getBackendURL from "~/utils/getBackendURL";
import type { GithubUserSearchResponse } from "~/types/common/search";
import type { GithubUser } from "~/types/GithubInfo";


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

const handleSearchDebounce = async(keyword : string) =>{

    const backendURL = getBackendURL();
    const urlParams = new URLSearchParams({
        name : keyword,
        per_page : "8"
    })


    const res  = await fetch(`${backendURL}/api/search?${urlParams.toString()}`, {
        credentials : "include"
    }).then(async(res)=>{
        return await res.json();
    })

    return res.data;
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






export default function SearchForm({Customform, CustomInput, CustomButton} : {Customform? : string, CustomInput? : string, CustomButton? :string}){
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const form = useRef<HTMLFormElement>(null);
    const input = useRef<HTMLInputElement>(null);
    const [debounce_data, setDebouceData] = useState<GithubUserSearchResponse>();

    let c : NodeJS.Timeout;

    const debounce = (e : ChangeEvent<HTMLInputElement, HTMLInputElement> )=>{
        clearTimeout(c);
        //console.log("search :", e.target.value);
        if(e.target.value === "" || e.target.value === undefined){
            console.log("empty");
            setDebouceData(undefined)
            return;
        }

        c = setTimeout(async()=>{
            const search = e.target.value;
            console.log("debounce 실행")
            const data = await handleSearchDebounce(search);
            setDebouceData(data);
            console.log("data : ", data);
        }, 1500)

        //console.log(e.currentTarget.value)
    }


    useEffect(()=>{
        return(()=> clearTimeout(c))   
    },[])

    console.log("items ", debounce_data?.items);

    return(
        <div className="relative flex flex-col w-full min-w-80 max-w-200 justify-center items-center">

         <form 
          ref={form}
          action ="/search"
          className ={Customform ? Customform : SearchFormCss.form}
          aria-label="Search for github users"
          onSubmit={(e)=>handleSearchSubmit(e, navigate)}
          >

            <input 
            ref={input}
            type="text"
            className={CustomInput ? CustomInput :SearchFormCss.input}
            placeholder="Search for users"
            name="search_name"
            onFocus={()=>{
                setIsVisible(true);
            }}
            onBlur={()=>{
                setIsVisible(false);
            }}
            onChange={
                debounce
            }>
            </input>

            <button 
            type="submit" 
            className={CustomButton ? CustomButton : SearchFormCss.submit_button }
            ></button>
        </form>

        <div className={`absolute top-full
            flex-col w-full gap-1 item px-2 bg-white max-h-80 overflow-y-scroll
            ${isVisible ? `flex` : `hidden` }
            `}>
            {
                debounce_data?.items.map((e, idx)=>
                    <button className= {`flex justify-between py-1 border-b border-github-light/50 
                        hover:bg-gray-400/50`}
                            key={idx}        
                            onMouseDown={(btn)=>{
                            btn.preventDefault();
                            input!.current!.value = e.login
                        }}
                    >
                        <img src={e.avatar_url} width="50" height="50"/>
                        <span> 
                            {e.login}
                        </span>
                    </button>
                ) 
            }
        
               
            
        </div>

        </div>

    )
}