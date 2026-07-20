import { useNavigate } from "react-router"
import HeaderLayout from "./HeaderLayout";
import LoginButton from "~/components/page/home/LoginButton";


export default function SearchHeader(){
    const navigate = useNavigate();
    const ID =  import.meta.env.VITE_GITHUB_CLIENT_ID;
    const URL = import.meta.env.VITE_GITHUB_CALLBACK_URL;
    return(
        <HeaderLayout onClick={()=>navigate("/")}>
            <LoginButton ID={ID} URL={URL} mode={"Tiny"}/>
        </HeaderLayout>
    )
}