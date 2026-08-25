import HeaderLayout from "./HeaderLayout";
import LoginButton from "~/components/page/home/LoginButton";
import useAuthCheck from "~/hooks/useAuthCheck";
import ProfileButton from "./ProfileButton";



export default function SearchHeader(){
    const ID =  import.meta.env.VITE_GITHUB_CLIENT_ID;
    const URL = import.meta.env.VITE_GITHUB_CALLBACK_URL;
    const { data, isLoading, isError, error } = useAuthCheck("dashboard");
    
    return(
        <HeaderLayout href="/">
            {data && data.success ? (
                <ProfileButton/>
                ):(
                <LoginButton ID={ID} URL={URL} mode={"Tiny"}/>
                )
            }
        </HeaderLayout>
    )
}