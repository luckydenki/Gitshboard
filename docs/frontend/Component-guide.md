# COMPONENT GUIDE

컴포넌트 구현 또는 수정을 요청할 시 다음과 같은 기본 규칙을 따르세요


## 참고 문서

컴포넌트를 구현하기 위해 `Storybook-guide.md` 와 `CSS-guide.md`를 추가로 숙지한다.
이미 읽었거나 이해하고 있다면 다시 읽지 말것


## components와 routes 폴더

1. 분리된 컴포넌트는 `/frontend/app/components` 안에, 라우팅된 컴포넌트는 `/frontend/app/routes` 안에 둔다. 

2. 컴포넌트는 다음과 같이 분리한다.

- common : 공통 컴포넌트. 여러 컴포넌트가 공유해서 쓰는 레이아웃이나, 그냥 다른 곳에서도 쓰는 컴포넌트 그 자체를 담는다.
- page : 페이지 컴포넌트. 그 페이지에서만 쓰는 컴포넌트를 모아둔다.
- compound : 컴파운드. 컴파운드 패턴을 쓰는 컴포넌트를 모아둔다.

3. routes의 경우, 기본적으로 `routes`바로 아래 작성하지만, 중첩, 동적 라우팅의 경우 그 라우팅 경로에 맞춰 `/` 단위로 폴더를 만들어 해당 폴더 안에 라우트 컴포넌트를 넣는다.


## 기본 규칙

1. 파일 하나의 대표 컴포넌트는 `export default function` 문으로 작성한다. 

2. 같은 파일내에 있는 부가 컴포넌트는 `export const ()=>{}`로 작성한다.

3. `useEffect`나 `useQuery`로 호출하는 모든 fetch 코드는 훅으로 분리한다. `/frontend/app/hooks/api` 아래에 작성한다.

4. 서버에서 받은 response를 프론트 UI에 맞게 한 번 더 재가공 해야 한다면 이 또한 별도의 훅으로 `/frontend/app/hooks/api`아래에 분리한다.

5. 순수 함수는 util로 분리하여 작성한다. 하나의 페이지에서만 쓴다면 `/frontend/app/utils/page` 아래에 작성하며, 여러 페이지에서 공통적으로 쓰면 `/frontend/app/utils/common` 아래에 작성한다.

6. 이벤트 핸들러 함수는 컴포넌트 내에 작성하며  명명 규칙은 `On(이벤트)(행동)andler` 
ex) OnChange에서 발생하는 자동완성 검색 컴포넌트인 경우 `OnChangeSearchHandler` 
(행동은 예시일 뿐 AutoSearch 이렇게 지어도 상관은 없음. 심지어 그 컴포넌트 내에 발생 가능한 유일한 이벤트라면 행동을 생략해도 된다. 핵심은 어떤 이벤트에서 발생할 핸들러인지 이름으로 알 수 있게 하면 됨)

7. 모든 태그는 최대한 시멘틱하게(의미에 맞게) 사용한다. 단, select, option과 같이 디자인에 제한이 될 수 있는 태그는 예외로 한다.

8. 모든 차트 UI는 Echart로 구현하며 Echart에서 지원하지 않는 스타일만 svg로 구현한다.

9. 모든 라우트 컴포넌트들은 `main` 태그로 시작해야 한다.

10. 모든 라우트 컴포넌트들은 기본적으로 `meta` 태그와 `title`을 작성해야한다.


## 분리 규칙

컴포넌트를 분리 지시하거나 파일 내 코드 길이가 200줄 이상인 경우 분리를 수행한다. [기본] 이라고 붙은 사항은 지시하지 않아도 수행해야 한다.

1. 모든 컴포넌트 파일은 200줄 이상을 넘어가면 안된다. 200줄 이상 넘어가는 컴포넌트는 자동으로 아래 규칙에 따라 분리작업을 시작한다.

2. 기본적으로 `section` `article` `nav` `aside` `ul, ol, li` `form` 단위로 나누고 `/frontend/app/components/page`아래에 작성한다.

3. [기본] 리스트 컴포넌트와 그 아이템 컴포넌트는 항상 쌍으로 하나의 파일 안에 묶여 다닌다. 이때 리스트 컴포넌트가 주 컴포넌트로 취급한다. 단, 이 또한 파일이 200줄 이상을 넘어가면 다른 파일로 분리한다.

4. [기본] 스켈레톤(또는 로딩) 컴포넌트, 재시도 표시 컴포넌트, 에러 표시 컴포넌트는 반드시 분리하고 같은 컴포넌트 파일 내에 묶여 관리한다. 이 컴포넌트들은 파일이 200줄이 넘어가도 다른 파일로 분리해선 안된다.

5. [기본] Echart로 작성한 차트 UI는 반드시 분리해서 관리한다. EchartOptions는 분리한 컴포넌트 내에서 관리하면 됨.


## 작명 규칙

1. 라우트 컴포넌트는 실제 라우트에 `/`를 제거하고 연결한 느낌으로 만든다. 다만, 동적 라우팅 요소는 네이밍에서 제외

ex) `/user` = `User`
ex) `/user/repository` = `UserRepository`
ex) `/user/repository/:repository` = `UserRepository` 

2. 일반적인 컴포넌트는 다음과 같은 작명 규칙을 따른다.

`라우트 + 컴포넌트의 목적 또는 행위 + {suffix}`

suffix 규칙은 아래 후술

3. 일반적인 레이아웃 흐름으로서의 `section`, `article`, `header`, `footer`, `nav` `aside` 는 그것 자체를 suffix로 붙힌다.

ex) repo 페이지에서 커밋 집계를 보는 섹션의 컴포넌트 `RepoCommitCountSection`

4. 리스트 컴포넌트는 `List`라는 suffix를 붙히고 그 리스트의 아이템은 `Item` suffix를 붙힌다.

ex) user 페이지에서 유저의 레포지토리 리스트를 보는 경우 `UserRepositoryList` 와 `UserRepositoryItem`

5. `button` 태그는 타입에 따라 suffix를 붙힌다. 예를 들어 type=button이면 `Button` type=submit 이면 `Submit`

6. `input` 태그 또한 타입에 따라 suffix를 붙힌다. 예를 들어 radio라면 `Radio` checkbox면 `Checkbox` inputField면 `input`

7. 로딩 또는 스켈레톤 컴포넌트는 `Skeleton` suffix를 붙힌다.

8. 재시도를 유도하는 컴포넌트는 (로딩 실패로 인한 재시도) `Retry` suffix를 붙힌다.

9. 에러 컴포넌트는 `Error` suffix를 붙힌다.

10. 레이아웃 컴포넌트는 `Layout` suffix를 붙힌다.

11. Echart로 인한 컴포넌트는 차트의 종류에 맞게 suffix를 붙힌다.

11. 공통 컴포넌트 명명 규칙은 일단 유연하게 둔다. 위의 Suffix 컨벤션만 잘 유지하면서 컴포넌트 이름을 붙힐 것



## 기타 사항
 
- 모든 컴포넌트의 Prop은 `Props` 로 이름을 짓고 같은 파일 내에서 관리한다.