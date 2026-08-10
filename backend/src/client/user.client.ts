


export interface GithubUser {
    id : number;
    login :  string;
    accessToken : string;
}



class UserClient {

    /**
     * 깃허브 API를 통해 사용자 정보 (자기 자신)를 가져오는 메서드
     * 
     * @param accessToken 
     * @returns 
     */
    public getUser = async(accessToken: string) => {
        try{
            const githubUserResponse = await fetch('https://api.github.com/user',
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    }
                }
            )
            // 깃허브 사용자 정보
            const githubUserData = await githubUserResponse.json() as GithubUser;
            return githubUserData;

        }catch(error){
            console.error("Error : Fetching Github user failed", error);
            return null;
        }
    }

}


const userClient = new UserClient();
export default userClient;