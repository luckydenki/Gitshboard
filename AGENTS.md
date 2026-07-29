# Common Rules
> 항상 실행해야 할 공통 규칙.
1. AGENTS.md가 변경되었을 지도 모르니 항상 한번씩 체크할것.
2. 작업 끝나고 빌드 테스트(npm run build) 절대 하지 말것.
3. 작업이 끝난 후에 사용한 토큰 량을 아래 양식대로 프로젝트 루트의 Token.md 에 기록할 것. (단 토큰 사용량이 필요 없다고 언급하면 수행 안해도 됨.)


>  프롬프트 내용
- 요청 시간 : yyyy-mm-dd
- 사용 토큰량 : 
- 토큰 사용률 : 

---


# Storybook Rules
> storybook을 수정, 추가, 삭제해달라는 요청에 필요한 규칙.
1. storybook mcp 의 이름은 `gitshboard-storybook-mcp` 임.
2. 어떤 컴포넌트의 스토리 북을 새로 작성하라는 요청은 MCP의 `get-storybook-story-instructions`을 호출하고, 그 지침에 따라 작성할 것.
3. 스토리의 테스트는 한글 이름으로 작성할 것...