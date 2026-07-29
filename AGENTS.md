# Common Rules
> 항상 실행해야 할 공통 규칙.
1. 작업 끝나고 빌드 테스트(npm run build) 절대 하지 말것.
2. 작업이 끝난 후에 사용한 토큰 량을 아래 양식대로 Token.md 에 기록할 것. (단 토큰 사용량이 필요 없다고 언급하면 수행 안해도 됨.)


>  프롬프트 내용
- 요청 시간 : yyyy-mm-dd
- input 토큰 :
- output 토큰 : 

---


# Storybook Rules
> storybook을 수정, 추가, 삭제해달라는 요청에 필요한 규칙.
1. storybook mcp 의 이름은 `gitshboard-storybook-mcp` 임.
2. 어떤 컴포넌트의 스토리 북을 새로 작성하라는 요청은 `get-storybook-story-instructions`을 호출하고, 그 지침에 따라 작성할 것.
3. 지금까지 업데이트 된 스토리를 수정해달라는 요청은 `get-changed-stories`를 호출하고,그에 기반하여 수정할 것.