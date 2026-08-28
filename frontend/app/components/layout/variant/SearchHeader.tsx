import HeaderLayout from "./HeaderLayout";
import LoginButton from "~/components/page/home/LoginButton";
import useAuthCheck from "~/hooks/useAuthCheck";
import ProfileButton from "./ProfileButton";



export default function SearchHeader(){
    const { isSuccess} = useAuthCheck();
    
    return(
        <HeaderLayout href="/">
            {isSuccess ? (
                <ProfileButton/>
                ):(
                <LoginButton mode={"Tiny"}/>
                )
            }
        </HeaderLayout>
    )
}