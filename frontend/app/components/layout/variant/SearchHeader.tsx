import { useNavigate } from "react-router"
import HeaderLayout from "./HeaderLayout";


export default function SearchHeader(){
    const navigate = useNavigate();

    return(
        <HeaderLayout onClick={()=>navigate("/")}>
        </HeaderLayout>
    )
}