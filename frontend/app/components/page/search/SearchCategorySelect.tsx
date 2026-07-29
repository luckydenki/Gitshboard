
interface SearchCategorySelectProps {
    setCategory : (category: string)=>void
}



export default function SearchCategorySelect({ setCategory } : SearchCategorySelectProps){

    return (
                <select name="selectedType" defaultValue="all"
                            className="p-2 hover:bg-gray-200 rounded-xl "
                            onChange ={(e)=>{ setCategory(e.target.value)}}
                        >
                            <option value ="all">
                                all
                            </option>
                            <option value="User">
                                User
                            </option>
                            <option value="Organization">
                                Organization
                            </option>
                        </select>
    )

}