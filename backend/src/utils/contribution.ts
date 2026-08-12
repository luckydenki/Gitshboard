import { CommitContributionActivity } from "../client/contribution.client";



export interface GithubCommitActivity {
    total : number,
    results : Array<{
        repositoryName : string,
        occuredAt : Array<string>,
        commitCount : Array<number>
    }>,
    commitOccuredAt : Array<string>,    // 모든 repository의 commit이 발생한 날짜를 합친 배열
    commitCounts : Array<number>        // 모든 repository의 commit이 발생한 날짜를 합친 배열에 대한 commitCount
}

/** 
 *  날짜를 연결시켜주는 함수 
 * 
 *  1. 두 날짜간의 차이를 본다.
 *  2. 그 차이 만큼 날짜를 1일 단위로 증가시키며 occuredAtArray에 추가하고, commitCountArray에는 0을 추가한다.
 *  3. 배열 끝까지 반복한다.
 * 
 * 
*/
export const ContinuousDate = ( occuredAtArray : Array<string>, commitCountArray : Array<number> ) => {

    let i=0;

    while(i<occuredAtArray.length-1){
        const currentDate = new Date(occuredAtArray[i]);
        const nextDate = new Date(occuredAtArray[i + 1]);
        const diffTime = Math.abs(nextDate.getTime() - currentDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));


        for(let j=1; j<diffDays; j++){
            const missingDate = new Date(currentDate);
            missingDate.setDate(currentDate.getDate() + j);
            const missingDateString = missingDate.toISOString();

            occuredAtArray.splice(i + j, 0, missingDateString);
            commitCountArray.splice(i + j, 0, 0);
        }
        //console.log(`occuredAtArray`, occuredAtArray, `commitCountArray`, commitCountArray);
        i += diffDays;  // 다음 날짜로 이동 (중간에 추가된 날짜 말고, 원래 배열의 다음 날짜로 이동)
    }
}

export const OccuredDateYYMMDD = ( occuredAtArray : Array<string> ) => {
    return occuredAtArray.map(date => {
        return date.split("T")[0];
    });
}



export const GithubCommitActivity = (data : CommitContributionActivity) : GithubCommitActivity => {

    const total = data.user.contributionsCollection.totalCommitContributions;
    const contributionsByRepository = data.user.contributionsCollection.commitContributionsByRepository;

    const arr : GithubCommitActivity = { total, results: [], commitOccuredAt : [], commitCounts : [] };

    const map = new Map<string, number>();

    contributionsByRepository.forEach((repos) => {
        const name = repos.repository.name;
        //console.log(`Repository: ${name}`);
        const contributions = repos.contributions.nodes;

        let occuredAtArray : Array<string> = [];
        let commitCountArray : Array<number> = [];

        contributions.forEach((contribution, idx) => {
            const occuredAt = contribution.occurredAt;
            const commitCount = contribution.commitCount;


            occuredAtArray.push(occuredAt);
            commitCountArray.push(commitCount);

            if(map.has(occuredAt)){
                map.set(occuredAt, map.get(occuredAt)! + commitCount);
            } else {
                map.set(occuredAt, commitCount);
            }
        })

        ContinuousDate(occuredAtArray, commitCountArray);
        occuredAtArray = OccuredDateYYMMDD(occuredAtArray);
        const arrCommitOccuredAt = OccuredDateYYMMDD(Array.from(map.keys()));

        arr.results.push({
            repositoryName : name,
            occuredAt : occuredAtArray,
            commitCount : commitCountArray
        })

        //console.log(`arr.results2`, Array.from(map.entries()));
        arr.commitOccuredAt = arrCommitOccuredAt;
        arr.commitCounts = Array.from(map.values());

    })

    return arr;
};