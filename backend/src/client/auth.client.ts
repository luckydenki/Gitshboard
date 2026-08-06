





class AuthClient {

    public getGithubAccessToken = async(code: string) : Promise<string | null> =>{

        try{
            // Github에 엑세스 토큰 요청
            const response = await fetch('https://github.com/login/oauth/access_token',
                {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        client_id: process.env.GITHUB_CLIENT_ID,
                        client_secret: process.env.GITHUB_CLIENT_SECRET,
                        code: code
                    })
                }
            );
            
            if(!response.ok){
                console.error("Error : Github access token request failed with status", response.status);
                return null;
            }

            const data = await response.json();
            console.log("Success : Github access token response:", data);
            
            // Github API를 사용하여 사용자 정보 요청
            const accessToken = data.access_token;
            return accessToken;

        }catch(error){
            console.error("Error : Github access token request failed", error);
            return null;
        }
    }


}



const authClient = new AuthClient();
export default authClient;