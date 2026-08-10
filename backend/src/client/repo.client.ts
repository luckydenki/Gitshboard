import { GithubLanguageRepositoryNode, GithubRepoCommonResponse, GithubCommitTimeRepositoryNode, GithubProjectTopicsNode, ProjectLiveRateNode } from "../types/stat";


const GithubGraphqlFetch = async(githubAccessToken: string, query: string, variables: any) =>{

    const github_response = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
            'Authorization': `token ${githubAccessToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query,
            variables
        })
    });

    return github_response;
};



class GithubRepoAPIClient{

    public  getLanguages = async( githubUsername : string, githubAccessToken : string) => {

    const query = `
            query GetRepoLanguages($login : String!){
                user(login : $login){
                    repositories(first:20, ownerAffiliations:OWNER){
                        nodes{
                            name
                            languages(first:20){
                                totalSize
                                edges{
                                    size
                                    node{
                                        name
                                    }
                                }
                            }
                        }
                    }
                }
            }
        `


    const variables = {
        login: githubUsername
    };

    try{
        const github_response = await GithubGraphqlFetch(githubAccessToken, query, variables);

        if(github_response.ok){
            const githubData = await github_response.json();
            const userData: GithubRepoCommonResponse<GithubLanguageRepositoryNode> = githubData.data;
            return userData;
        }
        else{
            return null;
        }
    } catch (error) {
        console.error("Failed to fetch languages from GitHub API", error);
        return null;
    }
};

    public getCommitTime = async(githubUsername : string, githubAccessToken : string) => {

        const query = `
            query GetCommitTimes($login : String!){
                user(login : $login){
                    repositories(first : 20){
                        nodes{
                            name
                            defaultBranchRef{
                                target{
                                    ... on Commit{
                                        history(first:50){
                                            nodes {
                                                committedDate
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }   
            }
        `

        const variables = {
            login: githubUsername
        }

        try {
            const github_response = await GithubGraphqlFetch(githubAccessToken, query, variables);

            if (github_response.ok) {
                const githubData = await github_response.json();
                const userData: GithubRepoCommonResponse<GithubCommitTimeRepositoryNode> = githubData.data;
                return userData;
            } else {
                return null;
            }
        } catch (error) {
            console.error("Failed to fetch commit times from GitHub API", error);
            return null;
        }
    };


    public getProjectTopics = async(githubUsername : string, githubAccessToken : string) => {
          //graphql query에서 String! 이라 되어있는건 String 만 가능하다는 것
                //!를 제거하면 String | null 이므로 null 도 허용된다
                const query = `
                    query GetProjectTopics($login : String!){
                        user(login : $login){
                            repositories(first : 20){
                                nodes {
                                    name
                                    repositoryTopics(first : 20){
                                        nodes {
                                            topic {
                                                name
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                `
        
                const variables = {
                    login: githubUsername
                }
        try{
                const github_response = await fetch("https://api.github.com/graphql", {
                    method: 'POST',
                    headers: {
                        'Authorization': `token ${githubAccessToken}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        query,
                        variables
                    })
                });
                
        
                if(github_response.ok){
                    const githubData = await github_response.json();
                    const userData: GithubRepoCommonResponse<GithubProjectTopicsNode> = githubData.data;

                    return userData;
                } else {
                    return null;    
                }
            } catch (error) {
                console.error("Failed to fetch project topics from GitHub API", error);
                return null;
            }
    }



    public getDevelopStats = async(githubUsername : string, githubAccessToken : string) => {

        const query = `
            query GetDevelopTime($login : String!){
                user(login : $login){
                    repositories(first : 20){
                        nodes {
                            defaultBranchRef{
                                target{
                                    ... on Commit{
                                        history(first : 30){
                                            nodes{
                                                committedDate    
                                            }
                                        }
                                    }
                                }
                            }
                            languages(first : 20){
                                edges{
                                    node{
                                        name
                                    }
                                }
                            }
                            repositoryTopics(first : 20){
                                nodes{
                                    topic{
                                        name
                                    }
                                }
                            }
                        }
                    }
                }
            }
        `

        const variables = {
            login: githubUsername
        }
        try{
        const github_response = await fetch("https://api.github.com/graphql", {
            method: 'POST',
            headers: {
                'Authorization': `token ${githubAccessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query,
                variables
            })
        })

        if (github_response.ok) {
            const githubData = await github_response.json();
            const userData: GithubRepoCommonResponse<GithubCommitTimeRepositoryNode & GithubLanguageRepositoryNode & GithubProjectTopicsNode> = githubData.data;
                return userData;
            } else {
                return null;
            }
        }

         catch (error) {
            console.error("Failed to fetch develop stats from GitHub API", error);
            return null;
        }
    }


    public getProjectLiveRate = async(githubUsername : string, githubAccessToken : string) => {

        const query = `
                query getProjectLiveRate($login : String!){
                    user(login : $login){
                        repositories(first : 20){
                            nodes{
                                createdAt
                                updatedAt
                                pushedAt
                                isArchived
                                isFork
                                name
                            }   
                        }
                    }
                }
            `

        const variables = {
            login: githubUsername
        }

        try {
            const github_response = await fetch("https://api.github.com/graphql", {
            method: 'POST',
            headers: {
                'Authorization': `token ${githubAccessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query,
                variables
            })
        });




        if (github_response.ok) {
            const githubData = await github_response.json();
            const userData: GithubRepoCommonResponse<ProjectLiveRateNode> = githubData.data;
            return userData;
        }
        else{
            return null;
        }
        }catch(error){
            console.error("Failed to fetch project live rate from GitHub API", error);
            return null;
        }
    }


}




const githubRepoAPIClient = new GithubRepoAPIClient();
export default githubRepoAPIClient;