/**
 * GithubCommitActivity는 CommitContributionActivity를 기반으로 만들어진 데이터 구조입니다.
 * 
 * - total : 총 commit 수
 * - results : 각 repository별 commit activity 정보
 *      - repositoryName : repository 이름
 *      - occuredAt : 해당 repository에서 commit이 발생한 날짜 배열
 *      - commitCount : 해당 repository에서 commit이 발생한 날짜 배열에 대한 commitCount
 * - commitOccuredAt : 모든 repository의 commit이 발생한 날짜를 합친 배열
 * - commitCounts : 모든 repository의 commit이 발생한 날짜를 합친 배열에 대한 commitCount
 */
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
