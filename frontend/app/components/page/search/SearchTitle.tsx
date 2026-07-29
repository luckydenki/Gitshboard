

interface SearchHeaderProps {
    name : string;
}



export default function SearchTitle({name} : SearchHeaderProps){
    return(
        <header> 
            <h2 className="not-md text-gray-900 font-semibold">Search Results for 
                <span className="text-github-light"> "{name}"</span>
            </h2>
        </header>
    )
}