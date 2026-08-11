import { CommitContributionActivity } from "../client/contribution.client";



export interface GithubCommitActivity {
    total : number,
    results : Array<{
        repositoryName : string,
        occuredAt : Array<string>,
        commitCount : Array<number>
    }>
}



export const GithubCommitActivity = (data : CommitContributionActivity) : GithubCommitActivity => {

    const total = data.user.contributionsCollection.totalCommitContributions;
    const contributionsByRepository = data.user.contributionsCollection.commitContributionsByRepository;

    const arr : GithubCommitActivity = { total, results: [] };

    contributionsByRepository.forEach((repos) => {
        const name = repos.repository.name;
        console.log(`Repository: ${name}`);
        const contributions = repos.contributions.nodes;

        arr.results.push({
            repositoryName : name,
            occuredAt : contributions.map((contribution)=>contribution.occurredAt),
            commitCount : contributions.map((contribution)=>contribution.commitCount) 
        })

    })

    return arr;
};