## API TYPE GUIDE

github api의 계약에 맞게 타입 또는 인터페이스를 만들어달라 는 부류의 모든 요청은 다음의 설명 주석 /** */ 를 추가로 작성하세요

GitHub GraphQL 원본 응답과 요청 변수 타입은 [백엔드의 GitHub GraphQL 타입 생성 규칙](../backend/AGENTS.md#github-graphql-타입-생성-규칙)에 따라 Codegen으로 생성합니다. 아래 주석 규칙은 수기로 작성하는 응답 DTO에 적용하며, 생성 파일은 직접 수정하지 않습니다.

1. 어떤 인터페이스, 타입인지 한 줄 요약해서 설명하세요
2. 그 github api의 url + 필요 method를 `req :` 라 키워드 붙히고 작성하세요
3. 그 API와 관련된 GITHUB API 공식 문서를 `link :`라 키워드 붙히고 작성하세요 (디테일하면 좋음)
4. Rest API기준인지, GraphQL 기준인지 `type :`이라 키워드 붙히고 작성하세요
5. (GraphQL의 경우) `graphQL:` 뒤에 원본 쿼리 파일 경로와 오퍼레이션 이름을 적으세요
6. 각 필드마다 어떤 데이터인지 필드 옆에 작성하세요
7. 만약 특정 필드는 직접적인 정보가 아니라 계산을 통해 얻어야 하는 정보라면 `derived:` 라는 키워드를 붙히고 어떤 데이터인지 작성하세요




ex)
```ts

/**
 * GitHub GraphQL 저장소 조회 결과를 가공한 화면용 DTO입니다.
 * type : GraphQL
 * req : POST https://api.github.com/graphql (인증 필요)
 * link : https://docs.github.com/en/graphql/reference/repos
 * graphQL: src/client/queries/github/viewer-repositories.query.ts — ViewerRepositories
 */
 export interface RepositoryItems {
    name: string;   //레포지토리 이름
    url: string;    //레포지토리 URL
    stargazerCount: number; //레포지토리 star 개수
    primaryLanguage: { name: string; color: string | null } | null; //주 언어
    updatedAt: string;  //최근 업데이트

    //derived 사용법을 알리기 위한 예시일 뿐임
    starAvg : number; //derived : 모든 레포의 스타 개수 평균
}

```
