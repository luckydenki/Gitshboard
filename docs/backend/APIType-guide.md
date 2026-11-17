# API Type GUIDE

이 가이드는 백엔드에서 알아둬야 할 API 타입을 생성 및 만드는 방식에 대한 가이드입니다.

## 공통

- 모든 api 관련 타입에는 무슨 api인지 한 줄 요약해서 설명하세요. 
- graphql 의 경우 쿼리 파일에 직접 무엇과 관련된 쿼리인지 요약해서 설명하세요.
- Github DTO의 경우, API 타입과 관련된 GITHUB API 공식 문서를 `link :`라 키워드 붙히고 작성하세요.

## Github Rest DTO

모든 Github Rest DTO 타입은 옥토킷에서 제공하는 `RestEndpointMethodTypes`를 통해 생성합니다.

- Github Rest 타입은 `src/types/github/rest`에 작성하여 관리하세요.
- 파일명은 `그룹-메서드.ts`로 이름을 지으세요 아래 예시를 보고 이해하면 됩니다.
- 타입명은 `GithubRest + Octokit 그룹 + 메서드 + Response`로 짓습니다.
```ts
//파일명 : search-repos.ts;
type GithubSearchRepos = RestEndpointMethodTypes["search"]["repos"]["response"]["data"];
```
- 이런식으로 **GithubRest** 로 작명된 시작하는 타입은 전부 Github API에서 Rest 방식으로 호출하는 타입이구나 를 알 수 있게 하면 됩니다.


## Github GraphQL DTO

모든 Github GraphQL 타입은 CodeGen을 활용해서 관리합니다. 

- Github GraphQL 쿼리는 `src/client/queries/github`에 작성하여 관리하세요
- 파일명은 kebab-case로 작성합니다. 조회는 `<기능>-<조회대상>.query.ts`, 변경은 `<동작>-<대상>.mutation.ts` 형식으로 짓습니다. 파일 하나에 이름이 있는 오퍼레이션 하나를 두고, 문자열 앞에 `/* GraphQL */`을 붙입니다.
- GraphQL 오퍼레이션 이름은 PascalCase로 작성하며, 조회는 `Get` 생성은 `Create` 삭제는 `Delete` 수정은 `Update`를 앞에 붙힙니다.

예를 들어 `RepoCommitTimes`처럼 대상을 중심으로 짓고, `GetSearchUsers`처럼 조회의 성격을 설명하는 동사는 사용합니다. 변경은 `Create`, `Update`, `Delete`, `Close`처럼 실제 동작을 나타내는 동사로 시작합니다.
- Codegen 파일 설정에 따라 도출되는 타입명은 `GithubGQL`이 Prefix로 알아서 붙습니다.

아래 예시를 보며 더 쉽게 이해해보세요

| 용도 | 파일명 | GraphQL 오퍼레이션 | TypeScript 상수 |
| --- | --- | --- | --- |
| 저장소 커밋 시간 조회 | `repo-commit-times.query.ts` | `GetRepoCommitTimes` | `GithubGQLGetRepoCommitTimesQuery` |
| 사용자 검색 | `search-users.query.ts` | `GetSearchUsers` | `GithubGQLGetSearchUsersQuery` |
| 이슈 댓글 작성 | `create-issue-comment.mutation.ts` | `CreateIssueComment` | `GithubGQLCreateIssueCommentMutation` |
| 이슈 댓글 삭제 | `delete-issue-comment.mutation.ts` | `DeleteIssueComment` | `GithubGQLDeleteIssueCommentMutation` |

- 쿼리를 추가하거나 변경한 뒤 `backend`에서 `npm run codegen`을 실행합니다. 생성 결과는 `src/types/github/graphql/operations.generated.ts`에 저장합니다.
- 호출부에서는 생성된 `*QueryVariables`로 요청 변수를 검사하고, GraphQL 호출 Client 유틸함수 `GithubGraphqlFetch<*Query>()`에 해당 쿼리의 생성 응답 타입을 전달합니다. GitHub 원본 응답 타입은 수기로 정의하지 않으며 생성 파일은 직접 수정하지 않습니다.

- 이런식으로 **GithubGQL** 로 시작하는 타입은 전부 Github API에서 graphql 방식으로 호출하는 타입이구나! 를 알 수 있으면 됩니다.



## Client 또는 Service 간 타입화

**Repository는 아직 거의 쓰지 않아서 지침을 지정하지 않았습니다 참고하세요**

- Github REST API Client에서 Service 레이어로 내려보낸 것은 데이터를 별도로 타입화 시켜 관리하세요. `Pick<T>` 문법을 활용하셔도 됩니다.
- graphQL은 가공할 필요 없이 필요한 데이터만 가져온 형태이므로 위에 언급한 query 타입 그대로 사용하시면 됩니다.
- 타입의 이름은 `Github + Octokit 그룹 + Dto`로 이름을 지으세요.
- 해당 타입을 저장하는 경로는 `/src/types/services` 에서 도메인 별로 생성 및 관리하면 됩니다.
 

## Sercice와 Controller 간 타입화

- 서비스에서 최종 가공 시킨 정보를 또 다시 타입화 시킬 필요가 있습니다.
- 이 타입들은 `/src/types/controllers`에서 도메인별로 생성 및 관리하세요
- 타입 이름은 `메서드+(도메인)+Data`로 이름을 지으세요.
- controller로 내려보낼 타입은 pick, omit등의 문법으로 만들지 말고 있는 그대로 작성하세요.


## 서버 Response (controller response)

- 모든 서버 response는 controller에서 생성합니다.
- 별도의 타입화는 필요없고, 서비스에서 가져온 Data를 `CommonResponse<T>`의 T에 넣어 만들면 됩니다.

