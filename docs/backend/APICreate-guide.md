# APICreate GUIDE

해당 문서는 API를 개설해달라고 하는 모든 요청에 대한 지침입니다.

(임시 규칙입니다. 이 규칙은 변경될 수 있으며, 우선은 controller나 service 파일로 분리시키지 말고 routes 파일 안에 모두 작성하세요)


## 공통 규칙
- 모든 최종 응답은 `CommonResponse<T>` 타입으로 작성됩니다. 해당 타입에 대한 설명은 CommonResponse 파일에서 직접 확인하세요
- 모든 최종 에러 응답은 `CommonErrorResponse` 타입으로 작성됩니다. 이를 위한 헬퍼 클래스 `CommonError` 도 존재하며, 필요한 경우에 잘 사용해보세요.


## 생성 규칙


1. 이 서비스의 api는 github api를 호출하여 그것을 정제하여 내려보내는 api와 순수한 우리 서버의 서비스 및 기능을 수행하는 api로 나뉩니다. 여기서 전자 타입을 "github service" 후자 타입을 "server service"로 약칭합니다.

2. 모든 응답은 `CommonResponse<T>`로, 모든 에러는 `CommonErrorResponse`로 작성하여 보냅니다.

3. github service는 항상 다음과 같은 절차로 response를 받아오세요
    2-1. github api를 octokit으로 호출하세요.
    2-2. graphql의 경우 `GithubGraphqlFetch<T>`함수를 사용하여 호출하세요
    2-3. graphql방식의 경우 - 응답 객체를 그냥 `response` 라고 받아오세요
        rest방식의 경우 - 응답 객체를 `{data : response}` 라고 받아오세요
        만약 호출하는 api가 여러가지면 `(적당히 직관적인 이름)_response`로 지으세요.
    2-6. 최종 CommonResponse로 만들 때 그 변수이름은 항상 `commonResponse`로, 그 안에 들어가는 data는 `data`라는 이름으로 새로 만들어서 대입시키세요

활용 예시 (graphql)
```ts
    const response = await GithubGraphqlFetch....  //graphql 방식
    
    const data  :UserInfo = {
       // ...response는 github graphql 규약이므로 우리 서버 규약에 맞게 적당히 대입해주시면 됩니다.
       //만약 완전히 동일하다면 그냥 data = response라고 해주시면 됩
    }

    const commonResponse : CommonResponse<UserInfo> = {
        status : 200,
        success : true,
        data
    }

    res.json(commonResponse)
```

(rest 예시)

```ts
    const { data : response }  = await octokit(...)  //rest 방식
    
    const data  :UserInfo = {
       // ...response는 github rest의 규약이므로 우리 서버 규약에 맞게 적당히 대입해주시면 됩니다.
       //만약 완전히 동일하다면 그냥 data = response라고 해주시면 됨
    }

    const commonResponse : CommonResponse<UserInfo> = {
        status : 200,
        success : true,
        data
    }

    res.json(commonResponse)
```


4. 에러 로직을 작성할 때는 발생 가능한 모든 에러 상황을 분석하여 알아서 판단하여 분기를 나누고, 이를 CommonErrorResponse로 치환시킨 후 `res.status().json()`문법으로 에러를 보내세요. 이때 상세 내용들은 모두 **한글**로 작성하는 것을 원칙으로 합니다.

- 이 에러 상황을 만들 때는 타입, 값의 범위 조건에 의한 오류뿐만 아니라, github api 호출에서 발생 가능한 에러 상황도 관리하셔야 합니다.


5. 모든 파라미터들은 구조 분해로 가져오세요 아래를 참고하시면 됩니다.

ex)
```ts
const { a, b, c } = req.query;
```

6. API를 개설 요청할 땐 반드시 다음 정보가 수반되어야 합니다.
    - CommonResponse의 데이터의 타입, 또는 어떤 객체나 데이터가 와야 하는지에 대한 정보
    - api 경로 이름과 메서드
    - (필요한 경우) api에 사용되는 쿼리 파라미터의 정보, 없으면 없다고 할 것
    - (POST, PUT, PATCH의 경우) api에 올라오는 요청 body, 없으면 없다고 할 것

이 정보가 제대로 제공되지 않는다면 작업을 수행하지 말고 요청자에게 물어보거나 추가적인 요청자의 조건을 확인해보시길 바랍니다.
GitHub GraphQL을 사용하는 API에서 서버 DTO만 생략됐다면, Codegen 응답 타입을 서버 DTO 이름으로 별칭을 붙여 사용하세요. 서버 DTO가 명시됐다면 해당 계약을 따르세요. 자세한 내용은 [API 타입 가이드](./APIType-guide.md#서버-dto)를 참고하세요.


6. 모든 API 생성 작업이 끝났다면 호출 테스트를 수행하여 응답이 정상적으로 도착하는 지만 확인하세요.



## 분리 규칙

현재 api는 크게 `routes`와 `controllers`와 `services`로 나뉩니다.

1. routes는 controllers를 호출하고 더 이상 무언가를 하지 마세요

2. controllers의 책임은 필요한 파라미터를 가져오고, 최종 에러와 응답을 호출하며 필요한 서비스를 호출하는 작업만 수행하면 됩니다.

3. services는 controllers에 담을 수 없는 나머지 실제 서비스 로직들이 들어가면 됩니다.

4. controllers와 services의 이름은 route의 도메인을 따서 만듭니다. 예를 들어, routes 파일 이름이 `repo.routes.ts`라면
controllers는 `repo.controllers.ts` services는 `repo.services.ts`입니다.

5. controllers와 services는 클래스로 만들고, `export default` 문법으로 모듈을 export 시키세요. 클래스명은 `도메인명`+Controllers 또는 `도메인명`+Services 로 짓습니다.

6. 발생 가능한 에러는 그 위치에서 바로바로 `CommonErrorResponse`를 만들어서 throw 시키세요. 이후 최종 에러의 처리는 Controller에서 책임져야 합니다.

7. **추가로 Github Client 로직이나 우리 서버의 Repository 로직(흔히들 DTO를 실제로 DB에서 가져오는 로직이죠!)**은 아직 분리하지마세요. 밑의 예시에서도 주석으로 놓긴 했지만, 그러한 fetch 또는 쿼리 조회 로직도 그냥 서비스 안에다가 넣어두십쇼.


```ts
//routes 파일 controller 호출 예시

import repoController from "../controllers/repo.controllers";

//언어 사용량
//api/repos/languages
repo_router.get("/languages", authToken, authUser, repoController.languages);
//이런식으로 라우터가 어떤 미들웨어들의 흐름으로 작업이 이루어지는 지 알 수 있게 하면 됨

```

```ts
//controller 예시

//라우터 명이 repo였기에 RepoController라고 짓습니다.
class RepoController {

public languages = async (req: AuthRequest, res: Response) => {
    if (!req.user) {
        const errorResponse: CommonErrorResponse = {
            type: "https://developer.github.com/v4",
            title: "Unauthorized",
            status: 401,
            detail: "인증된 사용자 정보가 없습니다.",
        };
        return res.status(401).json(errorResponse);     
        //Controller 자체에서 발생 가능한 에러는 이렇게 바로 응답을 만들면 됩니다.
    }

    const data = await repoService.getLanguages(
        req.user.githubUsername,
        req.user.githubAccessToken,
    );  

    if (data) {
        const responseData: CommonResponse<LanguageStat[]> = {
            success: true,
            status: 200,
            data: data,
        };
        res.status(200).json(responseData);
    } else {
        const errorResponse: CommonErrorResponse = {
            type: "https://developer.github.com/v4",
            title: "GitHub API Error",
            status: 500,
            detail: "레포지토리 언어 사용량 정보를 가져오는 데 실패했습니다.",
        };
        res.status(500).json(errorResponse);
      
        }
    };
};


const repoController = new RepoController();
export default repoController;

```


```ts
//service 예시

class RepoService {
    public getLanguages = async (githubUsername: string, githubAccessToken: string | undefined) => {
        const cachedData = await redisRepository.get<LanguageStat[]>(
            createRedisKey(githubUsername, "languages"),
        );

        if (cachedData) {
            console.log("Redis hit : languages");
            return cachedData;
        }

        try {
            const userData = await githubRepoAPIClient.getLanguages(githubUsername, githubAccessToken);
            //주의 : 아직 Client, Repository로직을 별도로 분리하지는 마세요 
            //차후에 처리할 부분이니 이런 부분도 

            if (!userData) {
                throw CommonError.create404Error(
                    "Github API 호출에 실패했습니다.",
                    `/api/repo/${githubUsername}/languages`,
                );  //발생가능한 에러는 그 즉시 CommonErrorReponse 형태로 throw하시면 됩니다.
            }

            const languageStats = calculateLanguageStats(userData);
            const success = await redisRepository.set(
                createRedisKey(githubUsername, "languages"),
                languageStats,
                REDIS_DATA_EXPIRATION,
            );

            if (!success) {
                console.error("Failed to set cache for languages");
                //redis 가 실패해도 통계 데이터는 반환합니다.
            }
            return languageStats;
        } catch (err) {
            console.error("Failed to fetch repository languages:", err);
            return null;
        }
    };
}

const repoService = new RepoService();
export default repoService;

```