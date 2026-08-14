
import { Log } from "~/utils/log_system/log";
import { useNavigate } from "react-router";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { GoSearch } from "react-icons/go";
import type { GithubUserSearchResponse } from "~/types/common/search";


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

    const urlParams = new URLSearchParams({
        name : keyword,
        per_page : "8"
    })


    const res  = await fetch(`/api/search?${urlParams.toString()}`, {
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

    submit_button : ` flex items-center justify-center size-12 
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
    const [debounce_data, setDebounceData] = useState<GithubUserSearchResponse>();

    let c = useRef<NodeJS.Timeout>(null);


    const start_time = useRef(0);



    const debounceExecure = async(e : ChangeEvent<HTMLInputElement, HTMLInputElement>)=>{
            start_time.current = 0;
            const data = await handleSearchDebounce(e.target.value);
            setDebounceData(data);
    }


    const debounce = async(e : ChangeEvent<HTMLInputElement, HTMLInputElement> )=> {
        clearTimeout(c.current!);

        // 데이터가 비어있거나 undefined이면 return
        if(e.target.value === "" || e.target.value === undefined){
            setDebounceData(undefined)
            return;
        }

        // 입력이 시작된 시간을 기록합니다. 단, 이미 기록되어 있으면 기록하지 않습니다.
        if(start_time.current === 0){
            start_time.current = Date.now();
        }

        //단, debounce가 일어나는 최소 시간도 존재해야 함. 2.5초 이상 입력이 존재하면 알아서 api 실행
        if(Date.now()-start_time.current > 2500){
            debounceExecure(e);
            return;

        }

        c.current = setTimeout(async()=>{
            debounceExecure(e);
        }, 1500)    //입력 종료 후 반드시 1.5초 이후에는 debounce가 실행됩니다.

    }


    useEffect(()=>{
        return(()=>{
            clearTimeout(c.current!);
        })
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
            aria-label="Search for github users input field"
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
            aria-label="Search users"
            className={CustomButton ? CustomButton : SearchFormCss.submit_button }
            >
                <GoSearch/>
            </button>
            {/* 
                해당 버튼과 인풋 필드는 UI를 설명할 텍스트가 없기 때문에 aria-label을 사용함
                aria-hidden를 사용하여 스크린 리더가 버튼을 (아이콘 까지 중복으로 읽는 것을) 무시하도록 함
            */}
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
                        <img src={e.avatar_url} alt={`${e.login}'s avatar`} width="50" height="50"/>
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
