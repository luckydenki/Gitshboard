## API TYPE GUIDE

github api의 계약에 맞게 타입 또는 인터페이스를 만들어달라 는 부류의 모든 요청은 다음의 설명 주석 /** */ 를 추가로 작성하세요

1. 어떤 인터페이스, 타입인지 한 줄 요약해서 설명하세요
2. 그 github api의 url + 필요 method를 `req :` 라 키워드 붙히고 작성하세요
3. 그 API와 관련된 GITHUB API 공식 문서를 `link :`라 키워드 붙히고 작성하세요 (디테일하면 좋음)
4. Rest API기준인지, GraphQL 기준인지 `type :`이라 키워드 붙히고 작성하세요
5. (GraphQL의 경우) 해당 정보를 가져오기 위한 쿼리를 작성하세요. 이때 `graphQL:` 이라 키워드 붙히고 작성하세요
6. 각 필드마다 어떤 데이터인지 필드 옆에 작성하세요
7. 만약 특정 필드는 직접적인 정보가 아니라 계산을 통해 얻어야 하는 정보라면 `derived:` 라는 키워드를 붙히고 어떤 데이터인지 작성하세요




ex)
```ts

/**
 * GitHub GraphQL 저장소 목록의 항목 타입입니다.
 * type : GraphQL
 * req : POST https://api.github.com/graphql (인증 필요)
 * link : https://docs.github.com/en/graphql/reference/repos
 * 
 * 
graphQL : 
 query {
   viewer {
     repositories(first: 10, ownerAffiliations: OWNER) {
       nodes { name url stargazerCount primaryLanguage { name color } updatedAt }
     }
   }
 }

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