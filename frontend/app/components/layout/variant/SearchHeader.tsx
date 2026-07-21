import { useNavigate } from "react-router"
import HeaderLayout from "./HeaderLayout";
import LoginButton from "~/components/page/home/LoginButton";
import useAuthCheck from "~/hooks/useAuthCheck";
import ProfileButton from "./ProfileButton";


export default function SearchHeader(){
    const navigate = useNavigate();
    const ID =  import.meta.env.VITE_GITHUB_CLIENT_ID;
    const URL = import.meta.env.VITE_GITHUB_CALLBACK_URL;
    const auth = useAuthCheck();
 
    return(
        <HeaderLayout onClick={()=>navigate("/")}>
            {!auth ? (
                <LoginButton ID={ID} URL={URL} mode={"Tiny"}/>
                ):(
                <ProfileButton/>
                )
            }
        </HeaderLayout>
    )
}