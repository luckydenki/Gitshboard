# API Type GUIDE

이 가이드는 백엔드에서 알아둬야 할 API 타입을 생성 및 만드는 방식에 대한 가이드입니다.

## 공통

- API 타입은 크게 "서버 DTO (실제 우리 서버에서 클라이언트로 내려보낼 Responst data 타입임)", "Github DTO(Github API 호출로 인한 DTO, graphql과 rest 방식 모두 포함)"로 나뉩니다. 이 둘은 별개로 관리해야 합니다.
- 모든 Github DTO는 무엇을 나타내는 타입인지 한 줄 요약해서 설명하세요. (graphql 은 쿼리 파일에 작성하면 됨)
- Github DTO의 경우, API 타입과 관련된 GITHUB API 공식 문서를 `link :`라 키워드 붙히고 작성하세요.

## Github Rest DTO

모든 Github Rest DTO 타입은 옥토킷에서 제공하는 `RestEndpointMethodTypes`를 통해 생성합니다.

- Github Rest 타입은 src/types/github/rest에 작성하여 관리하세요.
- 파일명은 `그룹-메서드.ts`로 이름을 지으세요 아래 예시를 보고 이해하면 됩니다.
- 타입명은 `Github + Octokit 그룹 + 메서드 + Dto`로 짓습니다.
```ts
//파일명 : search-repos.ts;
type GithubSearchReposDto = RestEndpointMethodTypes["search"]["repos"]["response"]["data"];
```

## Github GraphQL DTO

모든 Github GraphQL 타입은 CodeGen을 활용해서 관리합니다. 

- Github GraphQL 쿼리는 src/client/queries/github에 작성하여 관리하세요
- 파일명은 kebab-case로 작성합니다. 조회는 `<기능>-<조회대상>.query.ts`, 변경은 `<동작>-<대상>.mutation.ts` 형식으로 짓습니다. 파일 하나에 이름이 있는 오퍼레이션 하나를 두고, 문자열 앞에 `/* GraphQL */`을 붙입니다.
- GraphQL 오퍼레이션 이름은 PascalCase로 작성합니다. 조회는 `RepoCommitTimes`처럼 대상을 중심으로 짓고, `SearchUsers`처럼 조회의 성격을 설명하는 동사는 사용합니다. 변경은 `Create`, `Update`, `Delete`, `Close`처럼 실제 동작을 나타내는 동사로 시작합니다.
- TypeScript 상수명은 `github` + 오퍼레이션 이름 + `Query` 또는 `Mutation`으로 작성합니다.

| 용도 | 파일명 | GraphQL 오퍼레이션 | TypeScript 상수 |
| --- | --- | --- | --- |
| 저장소 커밋 시간 조회 | `repo-commit-times.query.ts` | `RepoCommitTimes` | `githubRepoCommitTimesQuery` |
| 사용자 검색 | `search-users.query.ts` | `SearchUsers` | `githubSearchUsersQuery` |
| 이슈 댓글 작성 | `create-issue-comment.mutation.ts` | `CreateIssueComment` | `githubCreateIssueCommentMutation` |
| 이슈 댓글 삭제 | `delete-issue-comment.mutation.ts` | `DeleteIssueComment` | `githubDeleteIssueCommentMutation` |

- 쿼리를 추가하거나 변경한 뒤 `backend`에서 `npm run codegen`을 실행합니다. 생성 결과는 `src/types/github/graphql/operations.generated.ts`에 저장합니다.
- 호출부에서는 생성된 `*QueryVariables`로 요청 변수를 검사하고, `GithubGraphqlFetch<*Query>()`에 해당 쿼리의 생성 응답 타입을 전달합니다. GitHub 원본 응답 타입은 수기로 정의하지 않으며 생성 파일은 직접 수정하지 않습니다.
- 프론트엔드에 전달하는 서비스 응답 DTO는 기존 `types/response` 규칙에 따라 관리합니다.


## 서버 DTO

- 우리 서버의 DTO는 기본적으로 /src/types/response 에서 생성 및 관리 해야합니다.
- **모든 서버 DTO가 github api와 연관 있는 것은 아닙니다!!**

- 서버 DTO가 github rest 와 연관이 있는 경우, `Pick` 문법을 활용해 필요한 필드만 걸러서 주세요.
- GitHub GraphQL을 사용하는 API의 서버 DTO를 사용자가 명시했다면 해당 계약을 따르세요. 서버 DTO를 명시하지 않았다면 `src/types/response`에 Codegen 응답 타입의 별칭을 선언하고, GraphQL 데이터 본문을 그대로 반환하세요.

```ts
export type GetSearchUsersDto = SearchUsersQuery;
```
- 만에 하나 제가 제안한 서버 DTO가 의미는 같지만 필드명이 다른 경우, 특정 필드가 다른데 통일 시킬 생각이 있냐고 물어봐주세요

- 파일명은 api 엔드포인트를 활용해서 짓습니다. 아래 예시를 참고하세요.
- 서버 DTO 타입명은 `HTTP 메서드 + 엔드포인트 이름 + Dto`로 짓습니다.

| 서버 API | DTO 파일명 | 응답 DTO 타입 |
| --- | --- | --- |
| `GET /api/search/users` | `search-users.ts` | `GetSearchUsersDto` |
| `GET /api/search/repos` | `search-repos.ts` | `GetSearchReposDto` |
| `GET /api/issues/:issueId/comments` | `issue-comments.ts` | `GetIssueCommentsDto` |
| `POST /api/issues/:issueId/comments` | `issue-comments.ts` | `PostIssueCommentsDto` |

- 필드 타입을 지정할 때는 가능한 한 엄밀한 타입으로 선언하세요. 이게 무슨 말이냐면, 가령 특정 필드는 문자열이여도 들어올 수 있는 값이 한정되어있는 경우가 있는데, 이런 경우 or 연산자로 타입을 엄밀하게 좁혀주라는 의미입니다. 

ex)
```ts
interface example{
    type : "users" | "repos" //string 으로 쓰기 보다 이렇게 적어달라는 것임
}
```
- 만약 어떤 응답 필드가 계산된 속성이라면 반드시 그 필드 옆 주석으로 (derived)라고 남겨주세요.
- GraphQL 응답 타입을 그대로 사용하는 기본 규칙이 적용되지 않는 API는, 서버 DTO가 명시되어 있거나 미리 정의되어 있는지 확인하세요. 둘 다 없다면 요청자에게 물어보세요.
- **설령 원래의 github dto를 그대로 쓰라고 해도, 서버 dto는 별도로 그걸 관리해야합니다. 주의하세요.**
