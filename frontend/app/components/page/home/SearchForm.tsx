
const handleSearchSubmit = (e: React.SubmitEvent<HTMLFormElement>)=>{
    e.preventDefault();
    console.log("Search button clicked ", e.currentTarget);
    const formData = new FormData(e.currentTarget);
    console.log("formData:", formData); 
}



export default function SearchForm(){

    return(
         <form className ={`flex flex-row
              w-full min-w-md max-w-4xl pl-6 pr-2 py-1
              border rounded-full border-gray-300 bg-white text-gray-950 shadow-md
          `}
          aria-label="Search for github users"
          onSubmit={handleSearchSubmit}
          onKeyDown={(e)=>{ 
            if(e.key === "Enter"){
              e.currentTarget.requestSubmit();
            }
          }}
          >


              <input 
                type="text"
                className={`flex-1 
                  text-md
                  not-sm:text-sm not-sm:h-12 
                  focus:outline-none 
                dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-github-light dark:focus:ring-github-light/50 
                  transition-all duration-200`}
                placeholder="Search for users"
                name="search_name"
              />


              <button 
              type="submit" 
              className={`
                size-12 bg-github-light/50     
                rounded-full
                hover:ring-2 hover:ring-github-light hover:bg-github-light/60
                focus:outline-none focus:ring-2 focus:ring-gray-800
                not-sm:size-12
                transition-all duration-200
                `}
            ></button>
          </form>
    )
}