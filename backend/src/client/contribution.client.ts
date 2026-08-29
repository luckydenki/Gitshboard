import { CommonErrorResponse, ErrorStatus } from "../types/middlewares/common";
import { GithubGraphqlFetch } from "./repo.client"



export interface CommitActivityRepositoryNode {
    name : string,
    nameWithOwner : string,
}

export interface CommitActivityConstributeNode {
    occurredAt: string,
    commitCount: number
}



export interface CommitContributionActivity {
    user : {
        contributionsCollection: {
            totalCommitContributions: number,
            commitContributionsByRepository: Array<{
                repository: CommitActivityRepositoryNode,
                contributions: {
                    nodes: Array<CommitActivityConstributeNode>,
                    pageInfo: {
                        hasNextPage: boolean,
                        endCursor: string | null
                    }
                }
            }>
        }
    }
}





class ContributionClient {


    /**
     * commitActivity를 가져오는 함수
     * 
     * 
     * @param githubAccessToken 
     * @param username 
     * @param from  
     * @param to 
     * 
     * 참고로 from과 to는 Date 객체를 ISO 8601 형식의 문자열로 변환하여 전달해야 합니다. 예: '2023-01-01T00:00:00Z'
     * 
     * Date내부 메서드 중 toISOString()를 사용하면 ISO 8601 형식의 문자열을 얻을 수 있습니다.
     * 
     * @returns 
     */
    public getCommitActivity = 
    async (githubAccessToken : string | undefined, username: string, from: string, to: string): Promise<CommitContributionActivity> => {
        
        try{
            // 날짜 기준으로 오름차순으로 가져와야함
            const query = `
                query GetCommitActivity(
                $username: String!,
                $from: DateTime!,
                $to: DateTime!
                ) {
                user(login: $username) {
                    contributionsCollection(from: $from, to: $to) {
                    totalCommitContributions

                    commitContributionsByRepository(maxRepositories: 100) {
                        repository {
                        name
                        nameWithOwner
                        }

                        contributions(
                            first: 100
                            orderBy : { field : OCCURRED_AT, direction: ASC }
                        ) {
                        nodes {
                            occurredAt
                            commitCount
                        }

                        pageInfo {
                            hasNextPage
                            endCursor
                        }
                        }
                    }
                    }
                }
                }
            `

            const variables = {
                username,
                from,
                to
            }
            console.log(`Fetching commit activity for user: ${username}, from: ${from}, to: ${to}`);

            const response = await GithubGraphqlFetch(githubAccessToken, query, variables);


            if(response.ok){
                const data = await response.json();
                console.log("GitHub API response data:", data);
                const commitActivity = data.data;

                return commitActivity;

            }
            else{
                const errorResponse : CommonErrorResponse = {
                    type: "https://docs.github.com/en/graphql/overview/explorer",
                    title: "GitHub API Error",
                    status: response.status as ErrorStatus,
                    detail: "Failed to fetch commit activity from GitHub API",
                    instance: "/graphql"
                }
                throw errorResponse;
            }

            
        }catch(error){
            console.error("Failed to fetch commit activity from GitHub API", error);

            if(error instanceof Error){
                const errorResponse : CommonErrorResponse = {
                    type: "https://docs.github.com/en/graphql/overview/explorer",
                    title: "GitHub API Error",
                    status: 500,
                    detail: error.message,
                    instance: "/graphql"
                }
                throw errorResponse;
            }

            throw error;
        }
    }



}


const contributionClient = new ContributionClient();
export default contributionClient;